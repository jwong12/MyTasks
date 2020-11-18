const createError = require('http-errors');
const express = require('express');
// const serveIndex = require('serve-index');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
// const fs = require('fs');
// const https = require('https');
// const forceSSL = require('express-force-ssl');

const taskRouter = require('./routes/tasksApiRoute');
const websiteRouter = require('./routes/websiteRoute');

// const hostname = '0.0.0.0';
// const httpsPort = 443;

// Https Set up
// const httpsOptions = {
// 	cert: fs.readFileSync('./ssl/mytasks_live.crt'),
// 	ca: fs.readFileSync('./ssl/mytasks_live.ca-bundle'),
// 	key: fs.readFileSync('./ssl/mytasks_live.key')
// };

const app = express();
// const httpsServer = https.createServer(httpsOptions, app);

// Authentication Set up
const session = require('cookie-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');

app.use(session({keys: ['OneHundredAnd1', 'OneHundredAnd2', 'OneHundredAnd3']}));
app.use(flash());

// Configure passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Configure passport-local to use account model for authentication
const Account = require('./models/Account');
passport.use(new LocalStrategy(Account.authenticate()));

passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

//End of Authentication Set up

//Connect to Mongodb using mogoose
mongoose.connect('mongodb://jameswong:A112XZ8@mongo-db:27017', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
});

const db = mongoose.connection;

db.on('error', () => {
	console.log('Failed to connect to mongodb. Exiting...');
	process.exit(1);
});

db.once('open', function() {
	console.log('Opened mongoDB connection')
});

process.on('SIGINT', () => {
	console.log("Stopping the process....");
	mongoose.connection.close((err) => {
		console.log("Shutting down.....");
	});
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use('/.well-known', serveIndex('public/.well-known', {'icons': true}));
// app.use(forceSSL);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/tasks', taskRouter);
app.use('/', websiteRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

// httpsServer.listen(httpsPort, hostname);

module.exports = app;
