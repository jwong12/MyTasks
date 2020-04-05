const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    datefrom: String,
    dateto: String,
    priority: String,
    category: String,
    status: String,
    createOn: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Task', taskSchema);