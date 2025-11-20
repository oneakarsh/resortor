const express = require('express');
const { register, login, getProfile, createAdmin, getAllUsers } = require('../controllers/authController');
const { authMiddleware, superadminMiddleware, permissionMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.post('/admin/create', authMiddleware, superadminMiddleware, permissionMiddleware('manage_admins'), createAdmin);
router.get('/admin/users', authMiddleware, superadminMiddleware, permissionMiddleware('manage_users'), getAllUsers);

module.exports = router;
