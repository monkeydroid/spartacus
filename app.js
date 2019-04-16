/**
 * Module dependencies.
 */
var express = require('express'),
    path = require('path'),
    // , favicon = require('serve-favicon')
    logger = require('morgan'),
    methodOverride = require('method-override'),
    bodyParser = require('body-parser'),
    errorHandler = require('errorhandler'),
    mongoose = require('mongoose') //mongo handling
    ,
    passport = require('passport') // login
    ,
    flash = require('connect-flash'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    favicon = require('serve-favicon')
    // , ejs = require('ejs');
    ,
    e = require('events'), 
    cors = require('cors');

var events = new e.EventEmitter();


var app = express();


app.use(cors())

//app.set('event',events);

//this line fixes a warining of mongoose deprecation
mongoose.Promise = global.Promise;
//DB connection
// mongoose.connect('mongodb://task.headapp.eu:27017/eye4taskDb');
// mongoose.connect('mongodb://192.168.1.7:27017/eye4taskDb');
//var uri = "mongodb://spartacus:Spartacus19@spartacus-zfxra.mongodb.net/spartacus"


mongoose.connect('mongodb://localhost:27017/Spartacus');
//mongoose.connect(uri);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:')); 
db.once('open', function() {
     console.log('connected with ' + db.name);
 });

// all environments
app.set('port', process.env.PORT || 3500);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
/*
no icon: favicon_empty.ico
   icon: favicon.ico
*/
//app.use(favicon(__dirname + '/public/images/favicon_empty.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'ilovescotchscotchyscotchscotch',
    resave: true,
    saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  

// development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
}
require('./app/routes.js')(app, passport);
require('./public/controllers/passport')(passport);

//TODO
// var https = require('https');
// var fs = require('fs');
//
// var options = {
//   key: fs.readFileSync('key.pem'),
//   cert: fs.readFileSync('cert.pem')
// };
// var server = https.createServer(options,app).listen(3500);
//FIXME
var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io').listen(server);
//require('./app/socketHandler.js')(io);