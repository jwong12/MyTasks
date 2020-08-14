const passport = require('passport');
const Account = require('../models/Account');
const Tasks = require('../models/Tasks');
const router = require('express').Router();

function authenticationMiddleware(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

router.get('/register', function(req, res) {
    res.render('register', {});
});

router.post('/register', function(req, res, next) {
    console.log('registering user');

    Account.register(new Account({username: req.body.username}), req.body.password, function(err) {
        if (err) {
            console.log('error while registering user!', err);
            return res.render('register', { errorStatus : '** ' + err.message + '.' });
        }

        console.log('user registered!');
        
        const demoTaskOne = {
            title: "Implement Counting sort algo",
            description: "Demo task 1",
            datefrom: "Tue Aug 18 2020",
            dateto: "Tue Aug 18 2020",
            category: "Personal Project",
            status: "Urgent",
            priority: "1",
        };

        const demoTaskTwo = {
            title: "Finish Task Manager project",
            description: "Demo task 2",
            datefrom: "Mon Jul 20 2020",
            dateto: "Fri Aug 14 2020",
            category: "Personal Project",
            status: "In Progress",
            priority: "2",
        };

        const demoTaskThree = {
            title: "Apply for dev jobs",
            description: "Demo task 3",
            datefrom: "Mon Aug 17 2020",
            dateto: "Fri Sep 04 2020",
            category: "Work",
            status: "In Progress",
            priority: "1",
        };

        const demoTaskFour = {
            title: "Grocery shopping",
            description: "Demo task 4",
            datefrom: "Sat Aug 29 2020",
            dateto: "",
            category: "Chore",
            status: "Active",
            priority: "3",
        };

        const demoTaskFive = {
            title: "Hiking day @ Grouse 11am",
            description: "Demo task 5",
            datefrom: "Sun Aug 30 2020",
            dateto: "",
            category: "Personal",
            status: "Active",
            priority: "2",
        };

        const newTasks = new Tasks({ username: req.body.username, tasks: [demoTaskOne, demoTaskTwo, demoTaskThree, demoTaskFour, demoTaskFive] });

        newTasks.save((err) => {
			if (err) {
				console.log('Failed to save the Tasks in Mongodb', err);
				res.status(500).json({ status: 'Failed to save the Tasks' });
				return;
			}
		});

        res.render('login', { success : '** The account was created.' });
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
            return res.render('login', { errorStatus : '** ' + info.message + '.' });
        }

        req.logIn(user, function(err) {
            if (err) { return next(err); }
            req.session.user = req.user;
            res.redirect('/');
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
