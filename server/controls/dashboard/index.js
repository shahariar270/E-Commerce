const Order = require("../../model/order");

class dashboard {
    async get_card_data (req, res){
        const allOrder = await Order.find()

        console.log({allOrder});
    }
}

module.exports = new dashboard