# Resort Booking System API

A complete Express.js API for a resort booking system with MongoDB integration, JWT authentication, and admin functionality.

## Features

- ✅ User authentication (Register/Login) with JWT
- ✅ Resort management with admin controls
- ✅ Booking system with price calculation
- ✅ Role-based access control (User/Admin)
- ✅ MongoDB integration with Mongoose
- ✅ CORS enabled
- ✅ Comprehensive error handling

## Tech Stack

- **Backend**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Additional**: CORS, dotenv

## Installation

1. **Clone the repository**
```bash
cd c:\Users\akarsh.ramesh\Scape
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file**
```bash
Copy .env.example to .env and update values:
MONGODB_URI=mongodb://localhost:27017/resort-booking
PORT=5000
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod

# Or update MONGODB_URI to your cloud MongoDB instance (e.g., MongoDB Atlas)
```

5. **Run the server**
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will be running at `http://localhost:5000`

## API Endpoints

### Authentication

- **POST** `/api/auth/register` - Register new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1234567890"
  }
  ```

- **POST** `/api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- **GET** `/api/auth/profile` - Get user profile (requires token)

### Resorts

- **GET** `/api/resorts` - Get all active resorts
- **GET** `/api/resorts/:id` - Get resort details
- **POST** `/api/resorts` - Create resort (Admin only)
  ```json
  {
    "name": "Sunny Beach Resort",
    "description": "Beautiful beachfront resort",
    "location": "Miami, Florida",
    "pricePerNight": 150,
    "amenities": ["Pool", "Spa", "Restaurant"],
    "maxGuests": 4,
    "rooms": 50,
    "image": "url_to_image"
  }
  ```

- **PUT** `/api/resorts/:id` - Update resort (Admin only)
- **DELETE** `/api/resorts/:id` - Delete resort (Admin only)

### Bookings

- **POST** `/api/bookings` - Create booking (requires auth)
  ```json
  {
    "resortId": "resort_id_here",
    "checkInDate": "2024-12-15",
    "checkOutDate": "2024-12-20",
    "numberOfGuests": 2,
    "specialRequests": "Late checkout requested",
    "paymentMethod": "credit_card"
  }
  ```

- **GET** `/api/bookings` - Get user's bookings (requires auth)
- **GET** `/api/bookings/:id` - Get booking details (requires auth)
- **PATCH** `/api/bookings/:id/status` - Update booking status (Admin only)
  ```json
  {
    "status": "confirmed"
  }
  ```

- **PATCH** `/api/bookings/:id/cancel` - Cancel booking (requires auth)
- **GET** `/api/bookings/admin/all` - Get all bookings (Admin only)

## Authentication

All protected endpoints require an `Authorization` header with a Bearer token:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are provided after successful login/registration and expire in 7 days.

## Project Structure

```
resort-booking-api/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   ├── resortController.js  # Resort operations
│   │   └── bookingController.js # Booking operations
│   ├── middleware/
│   │   └── auth.js              # JWT verification
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Resort.js            # Resort schema
│   │   └── Booking.js           # Booking schema
│   └── routes/
│       ├── authRoutes.js        # Auth endpoints
│       ├── resortRoutes.js      # Resort endpoints
│       └── bookingRoutes.js     # Booking endpoints
├── server.js                    # Main server file
├── .env.example                 # Environment variables template
└── package.json                 # Dependencies
```

## Usage Examples

### 1. Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1234567890"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Get all resorts
```bash
curl -X GET http://localhost:5000/api/resorts
```

### 4. Create a booking
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "resortId": "resort_id",
    "checkInDate": "2024-12-15",
    "checkOutDate": "2024-12-20",
    "numberOfGuests": 2,
    "paymentMethod": "credit_card"
  }'
```

## Security Notes

- Always update `JWT_SECRET` in production
- Use HTTPS in production
- Store sensitive data in environment variables
- Validate all user inputs
- Use strong passwords for user accounts
- Never commit `.env` file to version control

## Future Enhancements

- Add payment gateway integration
- Implement reviews and ratings system
- Add email notifications
- Create admin dashboard
- Implement rate limiting
- Add database backups
- Implement search and filters
- Add availability calendar

## Troubleshooting

**MongoDB connection error:**
- Ensure MongoDB is running locally or update MONGODB_URI with correct connection string
- Check network connectivity if using remote database

**Token expiration:**
- Log in again to get a new token
- Token expires in 7 days by default

**Admin operations failing:**
- Verify the user has admin role in the database
- Check if valid token is provided in Authorization header

## License

ISC
