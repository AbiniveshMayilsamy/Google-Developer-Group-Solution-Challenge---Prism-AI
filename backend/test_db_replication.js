require('dotenv').config();
const mongoose = require('mongoose');
const { sequelize, Organization, User, Transaction, Audit } = require('./services/db');
const { replicate } = require('./services/replication');
const MongoOrg = require('./models/Organization');
const MongoUser = require('./models/User');

async function testReplication() {
  console.log('🚀 Starting Dual-Database Replication Test...');
  
  try {
    // 1. Connect to both databases
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB standby');
    
    await sequelize.authenticate();
    console.log('✅ Connected to SQL primary');
    
    // Sync SQL schemas
    await sequelize.sync({ force: true });
    console.log('✅ SQL schemas synchronized');
    
    // Clean up MongoDB collections for clean test run
    await MongoOrg.deleteMany({});
    await MongoUser.deleteMany({});
    console.log('🧹 Cleaned Mongo test collections');

    // 2. Insert organization into SQL
    console.log('\n--- Test 1: Organization Replication ---');
    const sqlOrg = await Organization.create({
      name: 'Google India Enterprise',
      slug: 'google-india',
      subscription: 'enterprise'
    });
    console.log(`Saved SQL Org: ${sqlOrg.name} (${sqlOrg.id})`);
    
    // Trigger replication
    await replicate('Organization', 'create', sqlOrg.toJSON());
    
    // Verify in MongoDB
    const mongoOrg = await MongoOrg.findOne({ sqlId: sqlOrg.id });
    if (mongoOrg) {
      console.log(`🎉 Success! Found replicated Org in Mongo: ${mongoOrg.name}`);
    } else {
      throw new Error('Org failed to replicate to Mongo');
    }

    // 3. Insert user into SQL linked to Org
    console.log('\n--- Test 2: User Replication with Relations ---');
    const sqlUser = await User.create({
      name: 'Abinivesh Leader',
      email: 'abinivesh@google.com',
      role: 'org_admin',
      organizationId: sqlOrg.id
    });
    console.log(`Saved SQL User: ${sqlUser.name} (${sqlUser.id})`);
    
    // Trigger replication
    await replicate('User', 'create', sqlUser.toJSON());
    
    // Verify in MongoDB
    const mongoUser = await MongoUser.findOne({ sqlId: sqlUser.id }).populate('organization');
    if (mongoUser) {
      console.log(`🎉 Success! Found replicated User in Mongo: ${mongoUser.name}`);
      console.log(`   Linked Mongo Org: ${mongoUser.organization?.name}`);
    } else {
      throw new Error('User failed to replicate to Mongo');
    }

    // 4. Test delete replication
    console.log('\n--- Test 3: Deletion Replication ---');
    await sqlUser.destroy();
    await replicate('User', 'delete', { id: sqlUser.id });
    
    const mongoUserAfterDelete = await MongoUser.findOne({ sqlId: sqlUser.id });
    if (!mongoUserAfterDelete) {
      console.log('🎉 Success! User was deleted from Mongo standby as well.');
    } else {
      throw new Error('Deletion failed to replicate to Mongo');
    }
    
    console.log('\n🎉 ALL REPLICATION TESTS COMPLETED SUCCESSFULLY!');
    
  } catch (err) {
    console.error('❌ Replication Test Failed:', err);
  } finally {
    await mongoose.disconnect();
    await sequelize.close();
    process.exit(0);
  }
}

testReplication();
