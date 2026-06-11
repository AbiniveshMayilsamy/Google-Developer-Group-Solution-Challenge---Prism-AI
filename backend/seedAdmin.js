require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function seedAdmin() {
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI is not set in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@prismai.com' });
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role}`);
      
      // Ensure the role is admin
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('   ✅ Role updated to admin');
      }
    } else {
      const admin = await User.create({
        name: 'Prism Admin',
        email: 'admin@prismai.com',
        password: 'PrismAdmin2026!',
        role: 'admin'
      });
      console.log('✅ Admin user created successfully:');
      console.log(`   Name: ${admin.name}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   ID: ${admin._id}`);
    }

    // Also create a default regular user for testing
    const existingUser = await User.findOne({ email: 'user@prismai.com' });
    if (!existingUser) {
      const user = await User.create({
        name: 'Prism User',
        email: 'user@prismai.com',
        password: 'PrismUser2026!',
        role: 'user'
      });
      console.log('✅ Default user created:');
      console.log(`   Email: ${user.email} / Password: PrismUser2026!`);
    } else {
      console.log('ℹ️  Default user already exists:', existingUser.email);
    }

    console.log('\n🎉 Database seeding complete!');
    console.log('   Admin login: admin@prismai.com / PrismAdmin2026!');
    console.log('   User login:  user@prismai.com / PrismUser2026!');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedAdmin();
