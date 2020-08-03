const express = require('express');
const Task = require('../models/taskModel');

const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Task Manager' });
});

router.get('/tasks', function(req, res, next) {
  res.render('tasks', { title: 'Task Manager' });
});

router.post('/api/tasks', (req, res) => {
	if(!req.body.title) {
    return res.status(400).json({msg : "Title can't be empty."});

  };

	const task = new Task(req.body);

  task.save((err) => {
		if (err) {
			return res.status(500).json({status: "Error in adding the task"});
    }
    
    res.json({status : "success", message : "Added a task!"});
	})
});

router.get('/api/tasks', (req, res) => {
  Task.find({}, (err, tasks) => {
		if(err) {
			return res.status(500).json({status: "Error retrieveing tasks"});
    }
    
    res.json(tasks);
	});
});

router.delete('/api/tasks/:id', function (req, res) {
  Task.findByIdAndRemove({ _id: req.body.id }, (err) => {
    if(err) {
      return res.status(500).json({status: "Error deleting task"});
    }
  });
});

module.exports = router;
