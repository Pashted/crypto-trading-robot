class Order {
    constructor(
        [ type, ts, price, amount = 0, status = 'new' ],
        { deposit, orders, fee, send, metadata, symbols: { sell, buy }, countOrders }
    ) {
        this.pair = sell + buy;

        this.status = status;

        this.active = true;

        this.id = Math.floor(Math.random() * 1000000);

        this.type = type;
        this.ts = ts;
        this.price = price;
        this.fee = fee;


        this._send = send;
        this._metadata = metadata;


        // amount of blocked currency
        if (amount) {
            this.amount = amount;

        } else {
            const _count = countOrders(orders),
                ordersCount = { sell: _count[0], buy: _count[1] }[type];

            this.amount = ordersCount

                          ? Object.keys(orders)
                              .reduce((total, orderID) => total + orders[orderID].amount, deposit[type]) / 5

                          : deposit[type] / 5;

        }


        this.add();

    }


    send({ action, ts = 0 }) {
        this._send({
            ...this._metadata,
            data: {
                type:   this.type,
                action,
                order:  [ ts || this.ts, this.price ],
                amount: this.amount,
                status: this.status,
                active: this.active,
                pair:   this.pair,
            }
        })
    }


    exec(ts) {
        this.active = false;

        this.result = this.type === 'buy'
                      ? this.amount / this.price
                      : this.amount * this.price;

        // exchange fee cut
        this.result *= 1 - this.fee / 100;

        this.send({ action: 'exec', ts });
    }


    add() {
        this.send({ action: 'add' });
    }


    setAmount(amount) {
        this.amount = amount;
    }


    edit([ ts, price ]) {
        this.ts = ts;
        this.price = price;

        this.send({ action: 'edit' });
    }

}

module.exports = Order;