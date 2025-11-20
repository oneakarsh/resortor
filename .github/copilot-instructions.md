<!-- Resort Booking API Development Guidelines -->

## Project Overview
This is an Express.js REST API for a resort booking system with MongoDB integration, JWT authentication, role-based access control, and a comprehensive permissions system.

## Architecture
- **Controllers**: Handle business logic for authentication, resorts, and bookings
- **Models**: Define MongoDB schemas (User, Resort, Booking)
- **Routes**: Define API endpoints with middleware protection
- **Middleware**: Handle JWT authentication, authorization, and permission validation
- **Config**: Database connection management

## Authentication & Authorization

### Roles
1. **User** - Standard user role
2. **Admin** - Can manage resorts and bookings
3. **SuperAdmin** - Full system control, can manage admins and users

### Middleware Error Handling
The `authMiddleware` now handles:
- Missing or malformed tokens (401)
- Expired tokens with specific message
- Invalid token structure
- Database connection errors

### Permissions System
Each role has specific permissions:
- **User**: view_resorts, create_booking, view_own_booking, cancel_own_booking
- **Admin**: All user permissions + create_resort, update_resort, delete_resort, view_all_bookings, update_booking_status, manage_users
- **SuperAdmin**: All permissions + manage_admins, system_settings, view_analytics

Use `permissionMiddleware('permission_name')` to protect routes with specific permissions.

## Development Guidelines

### Adding New Features
1. Create model in `src/models/` if needed
2. Create controller in `src/controllers/` with business logic
3. Create routes in `src/routes/` with proper middleware
4. Use `authMiddleware` for authenticated routes
5. Use `permissionMiddleware('permission_name')` for fine-grained access control
6. Use `superadminMiddleware` for super admin only operations

### Authentication
- JWT tokens expire in 7 days
- Tokens are passed via `Authorization: Bearer <token>` header
- Password hashing uses bcryptjs with 10 salt rounds
- Use `comparePassword()` method for validation
- Proper error messages for different failure scenarios

### Database
- MongoDB connection string in `.env` file
- Use Mongoose for schema validation
- Handle connection errors gracefully
- Validate role changes in User model

### Error Handling
- Auth middleware catches and logs errors with specific messages
- Return appropriate HTTP status codes:
  - 400: Bad Request (invalid input)
  - 401: Unauthorized (missing/invalid token)
  - 403: Forbidden (insufficient permissions)
  - 409: Conflict (duplicate email)
  - 500: Server Error
- Include descriptive error messages in responses
- All responses include `success` field (true/false)

### Data Validation
- Validate required fields in controllers
- Use regex for email validation in User model
- Check resort availability before booking
- Ensure dates are valid (checkout after checkin)
- Validate role transitions

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile (requires auth)
- POST `/api/auth/admin/create` - Create admin (SuperAdmin only)
- GET `/api/auth/admin/users` - List all users (SuperAdmin only)

### Resorts
- GET `/api/resorts` - Get all active resorts
- GET `/api/resorts/:id` - Get resort details
- POST `/api/resorts` - Create resort (Admin+)
- PUT `/api/resorts/:id` - Update resort (Admin+)
- DELETE `/api/resorts/:id` - Delete resort (Admin+)

### Bookings
- POST `/api/bookings` - Create booking (Authenticated users)
- GET `/api/bookings` - Get user's bookings (Authenticated users)
- GET `/api/bookings/:id` - Get booking details
- PATCH `/api/bookings/:id/status` - Update status (Admin+)
- PATCH `/api/bookings/:id/cancel` - Cancel booking
- GET `/api/bookings/admin/all` - Get all bookings (Admin+)

## Common Tasks

### Create a SuperAdmin User (Manual)
Edit the database directly or use the API with temporary admin token to promote first admin to superadmin.

### Create an Admin (SuperAdmin only)
```bash
POST /api/auth/admin/create
Authorization: Bearer <superadmin_token>
Content-Type: application/json

{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "secure_password",
  "phone": "+1234567890"
}
```

### Create a Resort (Admin+)
```bash
POST /api/resorts
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Resort Name",
  "description": "Description",
  "location": "Location",
  "pricePerNight": 150,
  "amenities": ["Pool", "Spa"],
  "maxGuests": 4,
  "rooms": 50
}
```

## Environment Variables
- `MONGODB_URI`: MongoDB connection string
- `PORT`: Server port (default: 5000)
- `JWT_SECRET`: Secret key for JWT signing
- `NODE_ENV`: Environment (development/production)

## Testing the API
Use curl, Postman, or Thunder Client. Always include the Authorization header for protected routes.

