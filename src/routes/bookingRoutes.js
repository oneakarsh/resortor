const express = require('express');
const {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getAllBookings,
} = require('../controllers/bookingController');
const { authMiddleware, adminMiddleware, permissionMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, permissionMiddleware('create_booking'), createBooking);
router.get('/', authMiddleware, permissionMiddleware('view_own_booking'), getUserBookings);
router.get('/admin/all', authMiddleware, adminMiddleware, permissionMiddleware('view_all_bookings'), getAllBookings);
router.get('/:id', authMiddleware, getBookingById);
router.patch('/:id/status', authMiddleware, adminMiddleware, permissionMiddleware('update_booking_status'), updateBookingStatus);
router.patch('/:id/cancel', authMiddleware, permissionMiddleware('cancel_own_booking'), cancelBooking);

module.exports = router;
