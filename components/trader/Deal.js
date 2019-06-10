class Deal {
    constructor(orderID) {

        this.openingOrderID = parseInt(orderID);

        this.active = true;

    }

    includes(orderID) {
        return this.closingOrderID ===  parseInt(orderID)
    }

    pushClosingOrder(orderID) {
        this.closingOrderID =  parseInt(orderID)
    }

    close() {
        this.active = false;
    }

}

module.exports = Deal;