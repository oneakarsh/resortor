const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resortId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resort',
      required: true,
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    numberOfGuests: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    specialRequests: String,
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'paypal'],
      default: 'credit_card',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
