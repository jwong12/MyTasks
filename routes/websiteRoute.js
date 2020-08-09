const passport = require('passport');
const Account = require('../models/Account');
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
            return next(err);
        }

        console.log('user registered!');

        res.redirect('/');
    });
});

router.get('/login', function(req, res) {
    res.render('login', {});
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
});

//The following routes render the task pages. But require authentication, hence the authenticationMiddleware
router.get('/', authenticationMiddleware, function(req, res) {
    console.log('In / User : ', req.user.username);
    res.render('index', {});
});
  
router.get('/tasks', authenticationMiddleware, function(req, res) {
    console.log('In /courses User : ', req.user.username);
    res.render('tasks', {});
});

module.exports = router;
