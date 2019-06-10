const _settings = require('../../components/storage/AppSettings'),
    _exchange = require('../../components/storage/ExchangeSettings'),
    Candles = require('../storage/Candles'),
    Session = require('../trader/Session'),
    Order = require('../trader/Order'),
    Deal = require('./Deal');


module.exports = {

    async start(request) {
        this.break = false;

        const settings = await _settings.get(),
            exchange = await _exchange.get({ exchange: settings.exchange });

        this.symbols = {
            sell: request.symbol,
            buy:  request.pair
        };

        this.startDeposit = {
            sell: parseFloat(exchange.deposit[0]),
            buy:  parseFloat(exchange.deposit[1])
        };
        this.deposit = { ...this.startDeposit };


        this.orders = {};
        this.deals = [];

        this.fee = exchange.fee;
        this.minStep = settings.minStep;

        this.send = request._send;
        this.metadata = {
            event:    request.action,
            infinity: true,
        };

        const { dc, fib } = await Candles.get(request);


        await new Promise(res => setTimeout(res, 500));

        return await this.process(dc, fib);
    },

    stop() {
        this.break = true;
        this.cancelOrders();
    },

    async process(dc, levels) {

        for (let i = 0; i < levels.length; i++) {

            if (this.break)
                throw new Error('Emulation process interrupted by User');

            await new Promise(res => setTimeout(res, 5));

            const [ ts, h3, h2, h1, l1, l2, l3 ] = levels[i],
                [ high, low ] = dc[i].slice(1);

            this.send({
                ...this.metadata,
                data: { ts, progress: (i / levels.length) * 50 }
            });

            for (let id in this.orders) {
                if (!this.orders.hasOwnProperty(id) || !this.orders[id].active)
                    continue;

                const { type, price, status } = this.orders[id],
                    isSell = type === 'sell',
                    isBuy = type === 'buy';


                if (
                    (isSell && high >= price) ||
                    (isBuy && low <= price)
                ) {

                    if (status === 'new')
                        this.openDeal(ts, id, isSell ? l1 : h1);
                    else
                        this.closeDeal(ts, id);
                }
            }


            const [ sellOrdersCount, buyOrdersCount ] = this.countOrders(this.orders);

            // if we have money to sell
            if (this.deposit.sell > 0) {

                if (sellOrdersCount < 1) {
                    this.addOrder('sell', ts, h3);
                    this.addOrder('sell', ts, h2);
                    this.addOrder('sell', ts, h1);

                } else if (sellOrdersCount < 2) {
                    this.addOrder('sell', ts, h2);
                    this.addOrder('sell', ts, h1);

                } else if (sellOrdersCount < 3) {
                    this.addOrder('sell', ts, h1);

                }
            }

            // if we have money to buy
            if (this.deposit.buy > 0) {

                if (buyOrdersCount < 1) {
                    this.addOrder('buy', ts, l3);
                    this.addOrder('buy', ts, l2);
                    this.addOrder('buy', ts, l1);

                } else if (buyOrdersCount < 2) {
                    this.addOrder('buy', ts, l2);
                    this.addOrder('buy', ts, l1);

                } else if (buyOrdersCount < 3) {
                    this.addOrder('buy', ts, l1);

                }

            }

        }

        this.cancelOrders();

        return true;

    },


    countOrders(orders) {

        let sell = 0, buy = 0;

        for (let id in orders) {
            if (!orders.hasOwnProperty(id) || !orders[id].type)
                continue;

            if (orders[id].type === 'sell')
                sell++;
            else
                buy++;
        }

        return [ sell, buy ]
    },


    inverseType(type) {
        return type === 'buy' ? 'sell' : 'buy';
    },


    findDeal(closingOrderID) {
        const [ deal ] = this.deals.filter(deal => deal.active && deal.includes(closingOrderID));
        console.log('findDeal', deal)
        return deal;
    },


    /**
     * It means (by the example of long)
     * 1. execute a hanging buy order
     * 2. open a new sell order relative to the executed order
     */
    openDeal(ts, orderID, nextPrice) {
        console.log('OPEN DEAL, orderID:', orderID);

        this.execOrder(ts, orderID);

        let deal = new Deal(orderID);

        const nextType = this.inverseType(this.orders[orderID].type),

            newPrice = nextType === 'buy'
                       ? this.orders[orderID].price * (1 - this.minStep / 100)
                       : this.orders[orderID].price * (1 + this.minStep / 100),

            nextOrderID = this.addOrder(nextType, ts, newPrice, this.orders[orderID].result, 'closing');

        deal.pushClosingOrder(nextOrderID);

        console.log(deal)

        this.deals.push(deal);

    },


    /**
     * It means (by the example of long)
     * 1. execute sell order
     * 2. resolve data for the subsequent opening of a new deal
     */
    closeDeal(ts, closingOrderID) {
        console.log('CLOSE DEAL, closingOrderID:', closingOrderID);

        this.execOrder(ts, closingOrderID);

        let deal = this.findDeal(closingOrderID);

        delete this.orders[deal.openingOrderID];
        delete this.orders[closingOrderID];

        deal.close();

    },


    addOrder(...orderData) {

        const [ type ] = orderData,
            order = new Order(orderData, this);

        this.deposit[type] -= order.amount;

        this.orders[order.id] = order;

        console.log(`~~ ${type} order BLOCKED ${order.amount} ${this.symbols[type]} at ${order.price}, deposit:`, this.deposit);

        return order.id;
    },


    execOrder(ts, orderID) {

        this.orders[orderID].exec(ts);

        const order = this.orders[orderID],
            mirrorType = this.inverseType(order.type);

        this.deposit[mirrorType] += order.result;


        console.log(`++ EXECUTED ${order.type} order, Result: ${order.result} ${this.symbols[mirrorType]}, deposit:`, this.deposit);

    },


    editOrder(type, oldOrder, order) {
        /*        this.send({
                    ...this.metadata,
                    data: {
                        action: 'edit',
                        type, order
                    }
                });*/


    },


    cancelOrders() {
        console.log('CANCEL ORDERS:');

        for (let id in this.orders) {
            if (!this.orders.hasOwnProperty(id) || !this.orders[id].active)
                continue;


            this.deposit[this.orders[id].type] += this.orders[id].amount;

            console.log(`## CANCELED ${this.orders[id].type} order, deposit:`, this.deposit);

            delete this.orders[id];

        }

        let profitSell = this.deposit.sell / this.startDeposit.sell * 100 - 100 || 0,
            profitBuy = this.deposit.buy / this.startDeposit.buy * 100 - 100 || 0;

        profitBuy = Math.floor(profitBuy * 1000) / 1000;

        console.log(`## Deposit: ${this.deposit.sell} ${this.symbols.sell}, ${this.deposit.buy} ${this.symbols.buy}`);
        console.log(`## Profit : ${profitSell}% ${this.symbols.sell}, ${profitBuy}% ${this.symbols.buy}`);

    }

};