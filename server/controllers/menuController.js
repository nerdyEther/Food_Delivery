const { MenuItem } = require('../models/models');


const getMenuItems = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;


        const sortField = req.query.sortBy || 'name';
        const sortOrder = req.query.order === 'desc' ? -1 : 1;
        const sortOptions = { [sortField]: sortOrder };

    
        const filter = {};
        
        if (req.query.category) {
            filter.category = req.query.category;
        }

        if (req.query.availability !== undefined) {
            filter.availability = req.query.availability === 'true';
        }

        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {};
            if (req.query.minPrice) {
                filter.price.$gte = parseFloat(req.query.minPrice);
            }
            if (req.query.maxPrice) {
                filter.price.$lte = parseFloat(req.query.maxPrice);
            }
        }

        if (req.query.search) {
            filter.name = { $regex: req.query.search, $options: 'i' };
        }


        const [items, total] = await Promise.all([
            MenuItem.find(filter)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit),
            MenuItem.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(total / limit);

        res.json({
            success: true,
            data: {
                items,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems: total,
                    itemsPerPage: limit,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                },
                filters: {
                    applied: filter,
                    sort: {
                        field: sortField,
                        order: req.query.order || 'asc'
                    }
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching menu items',
            error: error.message
        });
    }
};


const getMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const menuItem = await MenuItem.findById(id);
        
        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        res.json({
            success: true,
            data: menuItem
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching menu item',
            error: error.message
        });
    }
};




const createMenuItem = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only admin can create menu items'
            });
        }

        const { name, category, price, availability, description } = req.body;

   
        if (!name || !category || price === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Name, category, and price are required'
            });
        }

        if (typeof price !== 'number' || price < 0) {
            return res.status(400).json({
                success: false,
                message: 'Price must be a positive number'
            });
        }

        const menuItem = new MenuItem({
            name,
            category,
            price,
            description,
            availability: availability ?? true
        });

        await menuItem.save();

        res.status(201).json({
            success: true,
            message: 'Menu item created successfully',
            data: menuItem
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating menu item',
            error: error.message
        });
    }
};


const updateMenuItem = async (req, res) => {
    try {
        if (!['admin', 'manager'].includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Only admin and manager can update menu items'
            });
        }

        const { id } = req.params;
        const { name, category, price, availability, description } = req.body;

       
        if (price !== undefined) {
            if (typeof price !== 'number' || price < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Price must be a positive number'
                });
            }
        }

        const menuItem = await MenuItem.findById(id);
        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

      
        if (name) menuItem.name = name;
        if (category) menuItem.category = category;
        if (price !== undefined) menuItem.price = price;
        if (availability !== undefined) menuItem.availability = availability;
        if (description !== undefined) menuItem.description = description;

        const updatedItem = await menuItem.save();

        res.json({
            success: true,
            message: 'Menu item updated successfully',
            data: updatedItem
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating menu item',
            error: error.message
        });
    }
};


const deleteMenuItem = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only admin can delete menu items'
            });
        }

        const { id } = req.params;

        const menuItem = await MenuItem.findById(id);
        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        await MenuItem.findByIdAndDelete(id);

        res.json({
            success: true,
            message: 'Menu item deleted successfully',
            data: { id }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting menu item',
            error: error.message
        });
    }
};

module.exports = {
    getMenuItems,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getMenuItem
};