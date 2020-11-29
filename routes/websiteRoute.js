const passport = require('passport');
const Account = require('../models/Account');
const Tasks = require('../models/Tasks');
const router = require('express').Router();

function authenticationMiddleware(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
}

router.get('/register', function(req, res) {
    res.render('register', {});
});

router.post('/register', function(req, res, next) {
    console.log('registering user');

    Account.register(new Account({username: req.body.username}), req.body.password, function(err) {
        if (err) {
            console.log('error while registering user!', err);
            return res.render('register', { errorStatus : err.message + '.' });
        }

        console.log('user registered!');
        
        const demoTaskOne = {
            task: "Do laundry (Demo #1)",
            category: "Chore",
            date: "Fri Nov 20 2020",
            status: "done",
            priority: "low",
        };

        const demoTaskTwo = {
            task: "Do project research (Demo #2)",
            category: "Work",
            date: "Mon Nov 23 2020",
            status: "in progress",
            priority: "high",
        };

        const demoTaskThree = {
            task: "Make design prototypes (Demo #3)",
            category: "Project",
            date: "Thu Nov 26 2020",
            status: "in progress",
            priority: "medium",
        };

        const demoTaskFour = {
            task: "Grocery shopping (Demo #4)",
            category: "Chore",
            date: "Sat Nov 28 2020",
            status: "active",
            priority: "low",
        };

        const demoTaskFive = {
            task: "Read 'The Productivity Project' book (Demo #5)",
            category: "Personal Development",
            date: "Sun Nov 29 2020",
            status: "active",
            priority: "medium",
        };

        const newTasks = new Tasks({ username: req.body.username, tasks: [demoTaskOne, demoTaskTwo, demoTaskThree, demoTaskFour, demoTaskFive] });

        newTasks.save((err) => {
			if (err) {
				console.log('Failed to save the Tasks in Mongodb', err);
				res.status(500).json({ status: 'Failed to save the Tasks' });
				return;
            }
            
            res.render('login', { success : 'The account was created.' });            
		});
    });
});

router.get('/login', function(req, res) {
    res.render('login', {});
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }, function(err, user, info) {
        if (err) { console.log(err) }

        if (!user) {
            console.log(info.message);
            return res.render('login', { errorStatus : info.message + '.' });
        }

        req.logIn(user, function(err) {
            if (err) { return next(err); }
            req.session.user = req.user;
            res.redirect('/tasks');
        });
    })(req, res, next);
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
});

//The following routes render the task pages. But require authentication, hence the authenticationMiddleware
router.get('/', authenticationMiddleware, function(req, res) {
    console.log('In / User : ', req.user.username);
    res.render('index', { username: req.user.username });
});
  
router.get('/tasks', authenticationMiddleware, function(req, res) {
    console.log('In /tasks User : ', req.user.username);
    res.render('tasks', { username: req.user.username });
});

module.exports = router;
