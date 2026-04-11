const calculateTotals = (cart) => {
    cart.total_quantity = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    cart.total_price = cart.items.reduce((acc, item) => acc + item.subtotal, 0);
};

module.exports = calculateTotals;