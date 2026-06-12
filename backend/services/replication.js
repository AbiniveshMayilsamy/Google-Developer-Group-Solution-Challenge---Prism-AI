const MongoUser = require('../models/User');
const MongoAudit = require('../models/Audit');
const MongoOrg = require('../models/Organization');
const MongoGroup = require('../models/Group');
const MongoTransaction = require('../models/Transaction');

/**
 * Replicates a database operation from SQL primary to NoSQL standby.
 * Does not block primary if standby connection fails, but logs error.
 */
async function replicate(modelName, action, data) {
  try {
    const sqlId = data.id ? data.id.toString() : null;
    if (!sqlId && action !== 'delete') {
      console.warn(`⚠️ Replication skipped: no ID provided for model ${modelName}`);
      return;
    }

    console.log(`🔄 Replicating SQL -> MongoDB [Model: ${modelName}, Action: ${action}, SQL ID: ${sqlId}]`);

    if (action === 'delete') {
      const query = { sqlId };
      switch (modelName) {
        case 'Organization':
          await MongoOrg.deleteOne(query);
          break;
        case 'Group':
          await MongoGroup.deleteOne(query);
          break;
        case 'User':
          await MongoUser.deleteOne(query);
          break;
        case 'Audit':
          await MongoAudit.deleteOne(query);
          break;
        case 'Transaction':
          await MongoTransaction.deleteOne(query);
          break;
      }
      return;
    }

    // Upsert logic
    if (modelName === 'Organization') {
      await MongoOrg.findOneAndUpdate(
        { sqlId },
        {
          name: data.name,
          slug: data.slug,
          subscription: data.subscription,
          active: data.active
        },
        { upsert: true, new: true }
      );
    } 
    
    else if (modelName === 'Group') {
      const org = data.organizationId ? await MongoOrg.findOne({ sqlId: data.organizationId.toString() }) : null;
      await MongoGroup.findOneAndUpdate(
        { sqlId },
        {
          name: data.name,
          description: data.description,
          organization: org ? org._id : null,
          organizationSqlId: data.organizationId ? data.organizationId.toString() : null
        },
        { upsert: true, new: true }
      );
    } 
    
    else if (modelName === 'User') {
      const org = data.organizationId ? await MongoOrg.findOne({ sqlId: data.organizationId.toString() }) : null;
      const group = data.groupId ? await MongoGroup.findOne({ sqlId: data.groupId.toString() }) : null;
      
      // Update by sqlId or email
      await MongoUser.findOneAndUpdate(
        { $or: [{ sqlId }, { email: data.email?.toLowerCase() }] },
        {
          sqlId,
          name: data.name,
          email: data.email?.toLowerCase(),
          password: data.password,
          googleId: data.googleId,
          role: data.role,
          status: data.status,
          organization: org ? org._id : null,
          organizationSqlId: data.organizationId ? data.organizationId.toString() : null,
          group: group ? group._id : null,
          groupSqlId: data.groupId ? data.groupId.toString() : null
        },
        { upsert: true, new: true }
      );
    } 
    
    else if (modelName === 'Transaction') {
      const user = data.userId ? await MongoUser.findOne({ sqlId: data.userId.toString() }) : null;
      await MongoTransaction.findOneAndUpdate(
        { sqlId },
        {
          time: data.time || new Date(),
          user: user ? user._id : null,
          userSqlId: data.userId ? data.userId.toString() : null,
          action: data.action,
          module: data.module,
          status: data.status
        },
        { upsert: true, new: true }
      );
    } 
    
    else if (modelName === 'Audit') {
      const user = data.userId ? await MongoUser.findOne({ sqlId: data.userId.toString() }) : null;
      await MongoAudit.findOneAndUpdate(
        { sqlId },
        {
          user: user ? user._id : null,
          userSqlId: data.userId ? data.userId.toString() : null,
          datasetName: data.datasetName,
          targetAttribute: data.targetAttribute,
          sensitiveAttribute: data.sensitiveAttribute,
          metrics: {
            disparateImpact: data.disparateImpact,
            statisticalParity: data.statisticalParityDifference,
            equalOpportunity: data.equalOpportunity || 1.0
          },
          status: data.status
        },
        { upsert: true, new: true }
      );
    }

    console.log(`✅ Replication success: ${modelName} ID ${sqlId}`);
  } catch (err) {
    console.error(`❌ Replication error for model ${modelName}:`, err.message);
    // Standard standby fail safety - don't crash primary flow
  }
}

module.exports = {
  replicate
};
