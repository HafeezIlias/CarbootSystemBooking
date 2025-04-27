require('dotenv').config();
const { User } = require('../models');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ where: { role: 'admin' } });
    
    if (existingAdmin) {
      console.log('Admin account already exists with email:', existingAdmin.email);
      process.exit(0);
    }
    
    // Admin account details - you can modify these as needed
    const adminData = {
      fullName: 'Admin User',
      email: 'admin@carboot.com',
      password: 'Admin@123', // This will be hashed by the User model hook
      phoneNumber: '1234567890',
      address: 'Admin Address',
      role: 'admin'
    };
    
    // Create admin user
    const admin = await User.create(adminData);
    
    console.log('Admin account created successfully!');
    console.log('Email:', admin.email);
    console.log('Password: Admin@123');
    console.log('Please change the password after first login');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin account:', error);
    process.exit(1);
  }
}

createAdmin(); 