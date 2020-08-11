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
		if(result.length > 0) {
			res.json(result[0].tasks);

		} else {
			res.json(null);
		}
	});
});

router.post('/', apiAuthenticationMiddleware, (req, res) => {
	if(!req.body.title) {
		return res.status(400).json({msg : "Title can't be empty."});
	};

	const task = req.body;
	const query = Tasks.where({ username: req.user.username });
	
	query.findOne((err, result) => {
		if (err) return handleError(err);
	
		if (result) {
			result.tasks.push(task);
	
		} else {
			result = new Tasks({ username: req.user.username, tasks: [task] });
		}  
	
		result.save((err) => {
			if (err) {
				console.log('Failed to save the Tasks in Mongodb', err);
				res.status(500).json({ status: 'Failed to save the Tasks' });
				return;
			}
		
			res.json({ status: 'Successfully added the Tasks' });
		});
	});
});

router.delete('/:id', function (req, res) {
	const query = Tasks.where({ username: req.user.username });
	
	query.findOne((err, result) => {
		if (err) return handleError(err);
	
		if (result) {
			result.tasks.pull(req.body.id);
	
			result.save((err) => {
				if (err) {
					console.log('Failed to remove a task in Mongodb', err);
					res.status(500).json({ status: 'Failed to remove a task' });
					return;
				}			
			});
		}		
	});
});

module.exports = router;
