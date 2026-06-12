require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

async function seedAdmin() {
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is not set in .env");
    process.exit(1);
  }

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // 1. Seed Admin
    let adminUser = await User.findOne({ email: "admin@prismai.com" });
    if (!adminUser) {
      adminUser = new User({
        name: "Prism Admin",
        email: "admin@prismai.com",
        password: "PrismAdmin2026!", // Plain password will be automatically hashed by User.js pre-save hook
        role: "super_admin",
        status: "active",
      });
      await adminUser.save();
      console.log("✅ MongoDB Admin created: admin@prismai.com / PrismAdmin2026!");
    } else {
      console.log("ℹ️  MongoDB Admin already exists");
    }

    // 2. Seed Standard User
    let standardUser = await User.findOne({ email: "user@prismai.com" });
    if (!standardUser) {
      standardUser = new User({
        name: "Prism User",
        email: "user@prismai.com",
        password: "PrismUser2026!", // Plain password will be automatically hashed by User.js pre-save hook
        role: "user",
        status: "active",
      });
      await standardUser.save();
      console.log("✅ MongoDB User created: user@prismai.com / PrismUser2026!");
    } else {
      console.log("ℹ️  MongoDB User already exists");
    }

    console.log("\n🎉 Database seeding complete!");
    console.log("   Admin login: admin@prismai.com / PrismAdmin2026!");
    console.log("   User login:  user@prismai.com / PrismUser2026!");

  } catch (err) {
    console.error("❌ Seed error:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedAdmin();
