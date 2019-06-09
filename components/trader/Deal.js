class Deal {
    constructor(order) {

        this.type = order.type;

        this.orders = [ order.index ];

        this.active = true;

    }

    check(index) {
        return this.orders.includes(index);
    }

    close(index) {
        this.orders.push(index);

        this.active = false;
    }

}

module.exports = Deal;