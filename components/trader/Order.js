class Order {
    constructor(
        [ type, ts, price, amount = 0, status = 'new' ],
        { deposit, orders, fee, send, metadata, depSymbols: { sell, buy } }
    ) {
        this.pair = sell + buy;

        this.index = orders[type].length;
        this.status = status;

        this.active = true;

        this.type = type;
        this.ts = ts;
        this.price = price;
        this.fee = fee;


        this._send = send;
        this._metadata = metadata;

        // amount of blocked currency
        this.amount = amount || (
            orders[type].length
            ? orders[type].reduce((total, order) => total + order.amount, deposit[type]) / 5
            : deposit[type] / 5
        );


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
                state:  this.state,
                pair:   this.pair,
            }
        })
    }

    add() {
        this.send({ action: 'add' });
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