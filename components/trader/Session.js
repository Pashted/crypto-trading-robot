const db = require('../../models/database');


class Session {
    constructor({ exchange, action, ticker, deposit, _send }) {

        this.exchange = exchange;
        this.action = action;
        this.ticker = ticker;
        this.startDeposit = deposit;
        this._send = _send;

        this.startDate = new Date();
        this.history = [];
        this.open = true;

        this.load()
            .catch(this.close)
            .then(this.open);

    }


    addHist({ event, deposit, orders }) {
        let elem = {
            timestamp: new Date(),
            event, deposit, orders
        };
        console.log(elem);
    }


    async load() {
        return true;
    }


    async save() {

        return true;
    }


    async open() {
        this.open = true;
        console.log('trade session opened');

        this.addHist({ event: 'open' });

        this._send({
            event:    this.action,
            infinity: true,
            data:     { status: 'open' }
        });

    }


    close() {
        if (this.open)
            this.open = false;

        this.addHist({ event: 'close' });

        this._send({
            event: this.action,
            data:  { close: true }
        });
        console.log('trade session closed');

    }


}


module.exports = {};