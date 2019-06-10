class Deal {
    constructor(order) {

        this.openingOrder = order;

        this.active = true;

    }

    includes(index) {
        return this.closingOrder.index === index;
    }

    pushNewOrder(order) {
        this.closingOrder = order;
    }

    close(order) {

        this.active = false;
    }

}

module.exports = Deal;