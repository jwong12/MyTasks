const express = require('express');
const Tasks = require('../models/Tasks');

const router = express.Router();

function apiAuthenticationMiddleware(req, res, next) {
	if (req.isAuthenticated()) {
		return next()
	}

	res.status(401).json({error : 'Unauthenticated request'});
}

router.get('/', apiAuthenticationMiddleware, (req, res) => {
	Tasks.find({ username: req.user.username }, (err, result) => {    
		console.log(result); //
		res.json(result[0].tasks);
	});
});

router.post('/', apiAuthenticationMiddleware, (req, res) => {
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
