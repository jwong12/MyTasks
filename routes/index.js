var express = require('express');
var router = express.Router();
const Task = require('../models/taskModel');

const tasks = []

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Task Manager' });
});

router.get('/tasks', function(req, res, next) {
  res.render('tasks', { title: 'Task Manager' });
});

// API Endpoints - specified in index.js through AJAX
router.post('/api/tasks', (req, res) => {
  console.log('/api/tasks');

	console.log('Received a body ', req.body); // ---

	if(!req.body.title) {
    return res.status(400).json({msg : "Title can't be empty."});

  } else if(!req.body.description) {
    return res.status(400).json({msg : "Description can't be empty."});
	};

	let task = new Task(req.body);
	tasks.push(task);
  console.log(tasks); // ---

	res.json({status : "success", message : "Added a task!"});

});

router.get('/api/tasks', (req, res) => {
	res.json(tasks);
});

module.exports = router;
