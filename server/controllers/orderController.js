const { Order, MenuItem } = require('../models/models');


const createOrder = async (req, res) => {
    try {
        const { items } = req.body;

     
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: 'Order must contain at least one item'
            });
        }

       
        let totalAmount = 0;
        const validatedItems = [];

        for (const item of items) {
            if (!item.menuItem || !item.quantity || item.quantity < 1) {
                return res.status(400).json({
                    message: 'Invalid item format. Each item must have menuItem and quantity'
                });
            }

          
            const menuItem = await MenuItem.findById(item.menuItem);
            if (!menuItem) {
                return res.status(404).json({
                    message: `Menu item ${item.menuItem} not found`
                });
            }

            if (!menuItem.availability) {
                return res.status(400).json({
                    message: `Menu item ${menuItem.name} is not available`
                });
            }

            totalAmount += menuItem.price * item.quantity;
            validatedItems.push(item);
        }

        const order = new Order({
            userId: req.user._id,
            items: validatedItems,
            totalAmount
        });

        await order.save();

        res.status(201).json({
            message: 'Order created successfully',
            order
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating order',
            error: error.message
        });
    }
};


const getOrders = async (req, res) => {
    try {
        let orders;

       
        if (['admin', 'manager'].includes(req.user.role)) {
            orders = await Order.find()
                .populate('userId', 'username')
                .populate('items.menuItem', 'name price');
        } else {
      
            orders = await Order.find({ userId: req.user._id })
                .populate('items.menuItem', 'name price');
        }

        res.json(orders);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching orders',
            error: error.message
        });
    }
};


const updateOrderStatus = async (req, res) => {
    try {
    
        if (!['admin', 'manager'].includes(req.user.role)) {
            return res.status(403).json({
                message: 'Only admin and manager can update order status'
            });
        }

        const { id } = req.params;
        const { status } = req.body;


        const validStatuses = ['Pending', 'Processing', 'Completed', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
            });
        }

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        order.status = status;
        await order.save();

        res.json({
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating order status',
            error: error.message
        });
    }
};

module.exports = {
    createOrder,
    getOrders,
    updateOrderStatus
};