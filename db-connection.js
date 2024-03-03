const mongoose = require('mongoose');
const db_uri = process.env.MONGO_URI;
const db = mongoose.connect(db_uri);

module.exports = db;