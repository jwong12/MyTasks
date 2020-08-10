const mongoose = require('mongoose');

const task = new mongoose.Schema({
    title: String,
    description: String,
    datefrom: String,
    dateto: String,
    priority: String,
    category: String,
    status: String,
    createOn: {type: Date, default: Date.now}
});

const tasks = new mongoose.Schema({
    username: String,
    tasks: [task]
})

module.exports = mongoose.model('Tasks', tasks);