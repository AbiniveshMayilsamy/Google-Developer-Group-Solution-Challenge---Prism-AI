require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const MongoUser = require("./models/User");

const { sequelize, User: SqlUser, Organization } = require("./services/db");

async function seedAdmin() {
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is not set in .env");
    process.exit(1);
  }

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Sync SQL database
    await sequelize.sync();
    console.log("✅ SQL Primary Database Synchronized");

    // Ensure a default organization exists for admin users
    let defaultOrg = await Organization.findOne({
      where: { slug: "prism-internal" },
    });
    if (!defaultOrg) {
      defaultOrg = await Organization.create({
        name: "Prism Internal",
        slug: "prism-internal",
        subscription: "enterprise",
      });
      console.log("✅ Created default Prism Internal organization");
    }

    const passwordHash = await bcrypt.hash("PrismAdmin2026!", 10);
    const userPasswordHash = await bcrypt.hash("PrismUser2026!", 10);

    // Seed into SQL PRIMARY (this is where auth queries from)
    let sqlAdmin = await SqlUser.findOne({
      where: { email: "admin@prismai.com" },
    });
    if (!sqlAdmin) {
      sqlAdmin = await SqlUser.create({
        name: "Prism Admin",
        email: "admin@prismai.com",
        password: passwordHash,
        role: "super_admin",
        status: "active",
        organizationId: defaultOrg.id,
      });
      console.log("✅ SQL Admin created: admin@prismai.com / PrismAdmin2026!");
    } else {
      console.log("ℹ️  SQL Admin already exists");
    }

    let sqlUser = await SqlUser.findOne({
      where: { email: "user@prismai.com" },
    });
    if (!sqlUser) {
      sqlUser = await SqlUser.create({
        name: "Prism User",
        email: "user@prismai.com",
        password: userPasswordHash,
        role: "user",
        status: "active",
        organizationId: defaultOrg.id,
      });
      console.log("✅ SQL User created: user@prismai.com / PrismUser2026!");
    } else {
      console.log("ℹ️  SQL User already exists");
    }

    // Also replicate to MongoDB standby (bypass pre-save hook to avoid double-hashing)
    const existingMongoAdmin = await MongoUser.findOne({
      email: "admin@prismai.com",
    });
    if (!existingMongoAdmin) {
      const mongoAdmin = new MongoUser({
        sqlId: sqlAdmin.id,
        name: "Prism Admin",
        email: "admin@prismai.com",
        password: passwordHash, // Already hashed by bcrypt
        role: "super_admin",
        status: "active",
      });
      // Bypass the pre-save hook that would double-hash
      await MongoUser.collection.insertOne(mongoAdmin.toObject());
      console.log("✅ MongoDB Admin replicated");
    }

    const existingMongoUser = await MongoUser.findOne({
      email: "user@prismai.com",
    });
    if (!existingMongoUser) {
      const mongoUser = new MongoUser({
        sqlId: sqlUser.id,
        name: "Prism User",
        email: "user@prismai.com",
        password: userPasswordHash, // Already hashed by bcrypt
        role: "user",
        status: "active",
      });
      // Bypass the pre-save hook that would double-hash
      await MongoUser.collection.insertOne(mongoUser.toObject());
      console.log("✅ MongoDB User replicated");
    }

    console.log("\n🎉 Database seeding complete!");
    console.log("   Admin login: admin@prismai.com / PrismAdmin2026!");
    console.log("   User login:  user@prismai.com / PrismUser2026!");
  } catch (err) {
    console.error("❌ Seed error:", err.message);
  } finally {
    await mongoose.disconnect();
    await sequelize.close();
    process.exit(0);
  }
}

seedAdmin();
