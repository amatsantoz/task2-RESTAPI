const { Sequelize, DataTypes } = require('sequelize');
// driver sqlite
//const sequelize = new Sequelize('sqlite::memory:');

// sql server
const sequelize = new Sequelize('NodeDB', 'amad', '123', {
	dialect: 'mssql',
	//host: "192.168.xx",
	dialectOptions: {
		// Observe the need for this nested `options` field for MSSQL
		options: {
			// Your tedious options here
			useUTC: false,
			dateFirst: 1,
		},
	},
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.newss = require('./news')(sequelize, Sequelize);
db.users = require('./user')(sequelize, Sequelize);
db.comments = require('./comment')(sequelize, Sequelize);

const News = db.newss;
const Comment = db.comments;


News.hasMany(Comment);
Comment.belongsTo(News);

module.exports = db;