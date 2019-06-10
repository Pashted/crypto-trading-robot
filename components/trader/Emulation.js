const _settings = require('../../components/storage/AppSettings'),
    _exchange = require('../../components/storage/ExchangeSettings'),
    Candles = require('../storage/Candles'),
    Session = require('../trader/Session'),
    Order = require('../trader/Order'),
    Deal = require('./Deal');


module.exports = {
    depSymbols:   {},
    startDeposit: {},
    deposit:      {},
    orders:       {},
    deals:       {},


    async start(request) {
        this.break = false;

        const settings = await _settings.get(),
            exchange = await _exchange.get({ exchange: settings.exchange });

        this.depSymbols.sell = request.symbol;
        this.startDeposit.sell = parseFloat(exchange.deposit[0]);
        this.deposit.sell = parseFloat(exchange.deposit[0]);

        this.depSymbols.buy = request.pair;
        this.startDeposit.buy = parseFloat(exchange.deposit[1]);
        this.deposit.buy = parseFloat(exchange.deposit[1]);

        this.fee = exchange.fee;
        this.minStep = settings.minStep;

        this.orders = { sell: [], buy: [] };
        this.deals = [];


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


            const [ ts, h3, h2, h1, l1, l2, l3 ] = levels[i];

            this.send({
                ...this.metadata,
                data: { ts, progress: (i / levels.length) * 50 }
            });

            await new Promise(res => setTimeout(res, 5));

            // if we have money to sell
            if (this.deposit.sell > 0 && this.orders.sell.length < 3) {

                if (this.orders.sell.length < 1) {
                    this.addOrder([ 'sell', ts, h3 ]);
                    this.addOrder([ 'sell', ts, h2 ]);
                    this.addOrder([ 'sell', ts, h1 ]);


                } else if (this.orders.sell.length < 2) {
                    this.addOrder([ 'sell', ts, h2 ]);
                    this.addOrder([ 'sell', ts, h1 ]);


                } else {
                    this.addOrder([ 'sell', ts, h1 ]);

                }


            }

            // if we have money to buy
            if (this.deposit.buy > 0 && this.orders.buy.length < 3) {

                if (this.orders.buy.length < 1) {
                    this.addOrder([ 'buy', ts, l3 ]);
                    this.addOrder([ 'buy', ts, l2 ]);
                    this.addOrder([ 'buy', ts, l1 ]);


                } else if (this.orders.buy.length < 2) {
                    this.addOrder([ 'buy', ts, l2 ]);
                    this.addOrder([ 'buy', ts, l1 ]);


                } else {
                    this.addOrder([ 'buy', ts, l1 ]);

                }

            }


            if (!i)
                continue;

            const [ high, low ] = dc[i].slice(1);


            [ ...this.orders.sell, ...this.orders.buy ]
                .forEach(order => {

                    if (!order.active)
                        return;


                    if (
                        (order.type === 'buy' && low <= order.price) ||
                        (order.type === 'sell' && high >= order.price)
                    ) {

                        if (order.status === 'new')
                            this.openDeal(ts, order, { h1, l1 });
                        else
                            this.closeDeal(ts, order);
                    }


                });

        }

        this.cancelOrders();

        return true;

    },


    addOrder(_order) {

        const [ type ] = _order,
            order = new Order(_order, this);

        this.deposit[type] -= order.amount;

        this.orders[type].push(order);

        console.log(`~~ New ${type} order BLOCKED ${order.amount} ${this.depSymbols[type]}, deposit:`, this.deposit);

        return order;
    },


    /**
     * It means (by the example of long)
     * 1. execute a hanging buy order
     * 2. open a new sell order relative to the executed order
     */
    openDeal(ts, order, { h1, l1 }) {
        console.log('OPEN DEAL', order.type === 'buy' ? 'LONG' : 'SHORT');

        this.execOrder(ts, order);


        let deal = new Deal(order);

        const newType = order.type === 'buy' ? 'sell' : 'buy',
            price = newType === 'buy' ? l1 : h1,
            // ? order.price * (1 - this.minStep / 100)
            // : order.price * (1 + this.minStep / 100);
            newOrder = this.addOrder([ newType, ts, price, order.result, 'closing' ]);

        deal.pushNewOrder(newOrder);

        this.deals.push(deal);

    },


    execOrder(ts, order) {

        order.exec(ts);

        const newType = order.type === 'buy' ? 'sell' : 'buy';

        this.deposit[newType] += order.result;


        console.log(`++ EXECUTED ${order.type} order, Result: ${order.result} ${this.depSymbols[newType]}, deposit:`, this.deposit);

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

    findDeal(index) {
        const [ deal ] = this.deals.filter(deal => deal.active && deal.includes(index));

        return deal;
    },

    /**
     * It means (by the example of long)
     * 1. execute sell order
     * 2. resolve data for the subsequent opening of a new deal
     */
    closeDeal(ts, newOrder) {
        console.log('CLOSE DEAL');

        const deal = this.findDeal(newOrder.index);

        this.execOrder(ts, newOrder);

        this.orders[deal.openingOrder.type].splice(deal.openingOrder.index, 1);

        this.orders[newOrder.type].splice(newOrder.index, 1);

        deal.close();

    },

    cancelOrders() {
        console.log('CANCEL ORDERS:');

        [ ...this.orders.sell, ...this.orders.buy ]
            .forEach(order => {

                if (order.active) {

                    console.log(order);

                    this.deposit[order.type] += order.amount;

                    console.log(`## CANCELED ${order.type} order, deposit:`, this.deposit);

                    this.orders[order.type].splice(order.index, 1);

                }
            });

        let profitSell = this.deposit.sell / this.startDeposit.sell * 100 - 100 || 0,
            profitBuy = this.deposit.buy / this.startDeposit.buy * 100 - 100 || 0;

        profitBuy = Math.floor(profitBuy * 1000) / 1000;

        console.log(`## Profit Absolute: ${this.deposit.sell} ${this.depSymbols.sell}, ${this.deposit.buy} ${this.depSymbols.buy}`);
        console.log(`## Profit Relative: ${profitSell}% ${this.depSymbols.sell}, ${profitBuy}% ${this.depSymbols.buy}`);

    }

};