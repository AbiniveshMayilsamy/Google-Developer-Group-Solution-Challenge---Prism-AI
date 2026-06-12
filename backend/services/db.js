const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

let sequelize;

if (process.env.DATABASE_URL) {
  console.log('🔌 Connecting Primary SQL to PostgreSQL...');
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  const sqlitePath = path.join(__dirname, '..', 'prism_primary.sqlite');
  console.log(`🔌 Connecting Primary SQL to local SQLite at: ${sqlitePath}`);
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: sqlitePath,
    logging: false
  });
}

// --- MODEL DEFINITIONS ---

// 1. Organization
const Organization = sequelize.define('Organization', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  subscription: {
    type: DataTypes.ENUM('free', 'enterprise'),
    defaultValue: 'free'
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

// 2. Group (e.g. Finance Team, Hiring Team, Healthcare Team, Compliance Team)
const Group = sequelize.define('Group', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

// 3. User
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    defaultValue: 'Prism User'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true // Allow null for Google sign-in
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('super_admin', 'org_admin', 'group_admin', 'user'),
    defaultValue: 'user'
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  }
});

// 4. Transaction (Telemetry History Logs)
const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  time: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false
  },
  module: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Success'
  }
});

// 5. Audit (Dataset Bias Audits)
const Audit = sequelize.define('Audit', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  datasetName: {
    type: DataTypes.STRING,
    defaultValue: 'Unknown Dataset'
  },
  targetAttribute: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sensitiveAttribute: {
    type: DataTypes.STRING,
    allowNull: false
  },
  disparateImpact: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  statisticalParityDifference: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  equalOpportunity: {
    type: DataTypes.DOUBLE,
    defaultValue: 1.0
  },
  status: {
    type: DataTypes.ENUM('Fair', 'Biased'),
    allowNull: false
  }
});

// 6. Permission (Granular Access Control)
const Permission = sequelize.define('Permission', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  resource: {
    type: DataTypes.STRING,
    allowNull: false
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// --- ASSOCIATIONS ---

// Organization -> Groups
Organization.hasMany(Group, { as: 'groups', foreignKey: 'organizationId', onDelete: 'CASCADE' });
Group.belongsTo(Organization, { foreignKey: 'organizationId' });

// Organization -> Users
Organization.hasMany(User, { as: 'users', foreignKey: 'organizationId', onDelete: 'SET NULL' });
User.belongsTo(Organization, { foreignKey: 'organizationId' });

// Group -> Users
Group.hasMany(User, { as: 'members', foreignKey: 'groupId', onDelete: 'SET NULL' });
User.belongsTo(Group, { foreignKey: 'groupId' });

// User -> Transactions
User.hasMany(Transaction, { as: 'transactions', foreignKey: 'userId', onDelete: 'CASCADE' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

// User -> Audits
User.hasMany(Audit, { as: 'audits', foreignKey: 'userId', onDelete: 'CASCADE' });
Audit.belongsTo(User, { foreignKey: 'userId' });

// User -> Permissions
User.hasMany(Permission, { as: 'permissions', foreignKey: 'userId', onDelete: 'CASCADE' });
Permission.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  Organization,
  Group,
  User,
  Transaction,
  Audit,
  Permission
};
