const router = require('express').Router();
const { auth } = require('../middleware/auth');
const { 
    register, 
    login 
} = require('../controllers/authController');
const { 
    getMenuItems,
    getMenuItem, 
    createMenuItem, 
    updateMenuItem, 
    deleteMenuItem 
} = require('../controllers/menuController');
const { 
    createOrder, 
    getOrders, 
    updateOrderStatus 
} = require('../controllers/orderController');


router.post('/register', register);
router.post('/login', login);


router.get('/menu', getMenuItems);
router.get('/menu/:id', auth, getMenuItem);
router.post('/menu', auth, createMenuItem);
router.put('/menu/:id', auth, updateMenuItem);
router.delete('/menu/:id', auth, deleteMenuItem);


router.post('/orders', auth, createOrder);
router.get('/orders', auth, getOrders);
router.put('/orders/:id/status', auth, updateOrderStatus);

module.exports = router;