const Booking = require('../models/Booking');
const Resort = require('../models/Resort');

exports.createBooking = async (req, res) => {
  try {
    const { resortId, checkInDate, checkOutDate, numberOfGuests, specialRequests, paymentMethod } =
      req.body;

    if (!resortId || !checkInDate || !checkOutDate || !numberOfGuests) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Get resort details
    const resort = await Resort.findById(resortId);
    if (!resort) {
      return res.status(404).json({ message: 'Resort not found' });
    }

    // Validate guest count
    if (numberOfGuests > resort.maxGuests) {
      return res
        .status(400)
        .json({ message: `Maximum guests allowed: ${resort.maxGuests}` });
    }

    // Calculate total price
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      return res
        .status(400)
        .json({ message: 'Check-out date must be after check-in date' });
    }

    const totalPrice = nights * resort.pricePerNight;

    const booking = new Booking({
      userId: req.userId,
      resortId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      totalPrice,
      specialRequests,
      paymentMethod,
    });

    await booking.save();
    res.status(201).json({ message: 'Booking created successfully', data: booking });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create booking', error: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId }).populate('resortId');
    res.json({ message: 'Bookings fetched successfully', data: bookings });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('userId').populate('resortId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is owner or admin
    if (booking.userId._id.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json({ data: booking });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch booking', error: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking status updated', data: booking });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update booking', error: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', data: booking });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel booking', error: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('userId').populate('resortId');
    res.json({ message: 'All bookings fetched', count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
};
