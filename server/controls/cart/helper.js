const calculateTotals = (cart) => {
    if (!cart.items || cart.items.length === 0) {
        cart.total_quantity = 0;
        cart.total_price = 0;
        return;
    }

    cart.total_quantity = cart.items.reduce(
        (acc, item) => acc + (item.quantity || 0),
        0
    );

    cart.total_price = cart.items.reduce(
        (acc, item) => acc + (item.subtotal || 0),
        0
    );
};

module.exports = calculateTotals;