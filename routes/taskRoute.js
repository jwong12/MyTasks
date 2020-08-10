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

	const task = req.body;
	const query = Tasks.where({ username: req.user.username });
	console.log('task: '); 	//
	console.log(task); 		//
	console.log('query: '); //
	console.log(query); 	//
	
	query.findOne((err, result) => {
		console.log('result: '); 	//
		console.log(result); 		//

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

// router.get('/api/tasks', (req, res) => {
//   	Task.find({}, (err, tasks) => {
// 		if(err) {
// 			return res.status(500).json({status: "Error retrieveing tasks"});
//     	}
    
//     	res.json(tasks);
// 	});
// });

router.delete('/:id', function (req, res) {
	Task.findByIdAndRemove({ _id: req.body.id }, (err) => {
		if(err) {
			return res.status(500).json({status: "Error deleting task"});
		}
	});
});

module.exports = router;
