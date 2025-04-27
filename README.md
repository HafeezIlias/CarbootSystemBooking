# Car Boot Sale Booking System

A comprehensive booking and management system for car boot sales designed to simplify event organization and vendor management.

## Features

- Event scheduling and management
- Vendor registration and booking
- Payment processing via Billplz
- Admin dashboard for event oversight
- User-friendly interface for vendors and customers

## Tech Stack

- Frontend: React.js
- Backend: Node.js with Express.js
- Database: MySQL with Sequelize ORM
- Payment Gateway: Billplz

## Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14.x or higher)
- [MySQL](https://dev.mysql.com/downloads/mysql/) (version 5.7 or higher)
- Web browser (Chrome, Firefox, Edge, etc.)
- Git (optional, for cloning the repository)

### Setup Instructions

1. **Clone the Repository**
   ```
   git clone https://github.com/your-username/Booking_system_Carboot.git
   cd Booking_system_Carboot
   ```
   Or download and extract the ZIP file from GitHub

2. **Install Dependencies**
   ```
   npm install
   cd client && npm install && cd ..
   ```

3. **Database Setup**
   - Create a new MySQL database named `carboot_db`
   - The application will automatically create tables when it first runs

4. **Configure Environment**
   - Create a `.env` file in the root directory
   - Add the following environment variables:
     ```
      # Server Configuration
      PORT=5000
      NODE_ENV=development

      # Database
      DB_HOST=localhost
      DB_USER=root
      DB_PASS=
      DB_NAME=carboot_db

      # JWT Authentication
      JWT_SECRET=carboot_secret_key_change_in_production

      # Email Configuration
      EMAIL_USER=your_email@gmail.com
      EMAIL_PASS=your_email_app_password

      # Billplz Payment Gateway
      BILLPLZ_API_KEY=your_billplz_api_key
      BILLPLZ_COLLECTION_ID=your_billplz_collection_id
      BILLPLZ_X_SIGNATURE_KEY=your_billplz_signature_key
      BILLPLZ_CALLBACK_URL=http://localhost:5000/api/payments/webhook
      BILLPLZ_REDIRECT_URL=http://localhost:3000/payment/status 
      ```
5. **Start the Application**
   - For development (runs both backend and frontend):
     ```
     npm run dev:full
     ```
   - Or run backend and frontend separately:
     ```
     # Backend only
     npm run dev
     
     # Frontend only (in a separate terminal)
     npm run client
     ```

6. **Access the Application**
   - Frontend: Open your browser and navigate to:
     ```
     http://localhost:3000
     ```
   - Backend API: Available at:
     ```
     http://localhost:5000/api
     ```

7. **Default Admin Login**
   - Username: `admin@example.com`
   - Password: `admin123`
   - **Important**: Change the default password after first login for security

## Development

### Project Structure

```
Booking_system_Carboot/
├── client/          # React.js frontend
├── config/          # Configuration files
├── middleware/      # Express middleware
├── models/          # Sequelize models
├── routes/          # API routes
├── services/        # Business logic and services
├── .env             # Environment variables
├── package.json     # Project dependencies
├── server.js        # Main server entry point
└── README.md        # Project documentation
```

### Running Locally

1. Start the development servers with `npm run dev:full`
2. Make backend changes in the root directory files
3. Make frontend changes in the `client` directory
4. The application uses hot-reloading, so most changes will apply automatically

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
