var User = require('./../models/users');
var passport = require('../public/controllers/passport');
var bcrypt = require('bcrypt-nodejs');
var util = util = require('util');
var Prenotation = require('./../models/prenotation');
var Aula = require('./../models/aula');


module.exports = function(app, passport, streams) {

    /* Things we need */
    //needed for reaching images and backgrounds;
    //if an image is in public/images/image.png, then use background url("images/image.png")
    var express = require('express');
    // var io = require('socket.io');
    var userGlobal = {};
    var shortnameGlobal = "";
    app.use(express.static('public'));



    var findRoom = function(req, res) {
        Aula.find()
            .sort({
                date: -1
            })
            .limit(5)
            .exec(
                function(err, data) {
                    if (err) {res.status(500).send(err);}
                    console.log('risultato '+JSON.stringify(data, null, 4));
                    res.json(data);
                });
    };

    /* Prenotation Database */
    // use mongoose to get last 5 prenotation inserted in the database
    var getPrenotations = function(req, res) {
        var id = req.params.operator_id;
        Prenotation.find()
            .sort({
                date: -1
            })
            .limit(5)
            .exec(
                function(err, instructions) {
                    if (err) res.status(500).send(err);
                    res.json(instructions);
                });
    };



    // Insert a new Instruction, information comes from AJAX request from Angular
    var addPrenotation = function(req, res) {
        console.log(JSON.stringify(req.body, null, 4));
        var time = new Date().getTime();
        var id = req.body.id;

        Prenotation.create({
                'prenotation_day': req.body.prenotation_day,
                'xml': req.body.xml,
                'id_room': req.body.room,
                'id_user': req.body.user,
                'event_name': req.body.event_name,
                'tipology': req.body.tipology
            },
            function(err, instruction) {
                if (err) res.status(500).send(err);
                // get and return last 8 Prenotation after you create another
                Prenotation.find({
                        roomId: id
                    })
                    .sort({
                        date: -1
                    })
                    .limit(8)
                    .exec(function(err, prenotations) {
                        if (err)
                            res.status(500).send(err)

                        res.json(prenotations);
                    });
               
            }); //end function find

    }; //end function addPrenotation

//creazione  aula
var addAula = function(req, res) {
    console.log(JSON.stringify(req.body, null, 4));
    var time = new Date().getTime();
    var name = req.body.name;

    Aula.create({

            'name': req.body.name,
            'posti': req.body.posti,
            'tipo': req.body.tipo,
            'lim': req.body.lim,
            'proiettore': req.body.proiettore,
            'ncomputer': req.body.ncomputer
        },
        function(err, instruction) {
            if (err) res.status(500).send(err);
            // get and return last 8 Prenotation after you create another
            Aula.find({
                    name: name
                })
                
                .exec(function(err, aula) {
                    if (err)
                        res.status(500).send(err)

                    res.json(aula);
                });
           
        }); //end function find

};
    


    /*Index/Control Room*/
 
    /* Login */
    //renders login page */
    var login = function(req, res) {
        var isLoggedIn = true;
        res.render('login', {
            title: 'Eye 4 Task',
            header: 'Eye4Task login',
            message: 'Please login',
            footer: 'www.headapp.eu',
            id: req.params.id,
        });
    };



   /* administration: CRUD */
    //READ: get all users by company_name
    var getPrenotationByUser = function(req, res) {
        console.log('userGlobal qui ' + JSON.stringify(userGlobal, null, 4) + " e req.user " + JSON.stringify(req.user, null, 4));
        Prenotation.findOne({
                'user': req.user.user
            })
            .populate('prenotation', '_id username name room_id')
            .exec(
                function(err, prenotations) {
                    if (err) res.status(500).send(err);
                    console.log("prenotation list " + JSON.stringify(prenotations, null, 4));
                    res.json(prenotations);
                });
    }; //end getUsersByCompany

    //CREATE: create a new user
    var createUser = function(req, res) {
        console.log("routes.js: user da creare: " + JSON.stringify(req.body, null, 4));
        //console.log("routes.js: req.user: " + JSON.stringify(req.user, null, 4));
        var newUser = new User({
            //id: req.body.id_company + "_" + req.body.username,
            //id_company: req.body.id_company,
            'username': req.body.username,
            'password': bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null),
            'name': req.body.name,
            'surname': req.body.surname,
            'category': req.body.category,
            'access_level': req.body.access_level
        });


  //  newUser.save(function (err, result){
   //     console.log(err);
   // });
//secondo metodo che crea e salva l'oggetto sul database
        User.create({
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null),
            name: req.body.name,
            surname: req.body.surname,
            category: req.body.category,
            access_level: req.body.access_level
        },
        function(err, instruction) {
            if (err) res.status(500).send(err);
            // get and return last 8 Prenotation after you create another
            User.find()
                .sort({
                    date: -1
                })
                .limit(8)
                .exec(function(err, prenotations) {
                    if (err)
                        res.status(500).send(err)

                    res.json(prenotations);
                });
           
        }); //end function find


            

    }; //end createUser

   // process the login form
    var doLogin = passport.authenticate('local-login', {
        successRedirect: '/', // redirect to the secure profile section
        //successRedirect: '/HSCindex'
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    });

 /*Index/Control Room*/
 var index = function(req, res) {
    //saving the user logged in in a global var
    //what arrives here is the object Company+user, passed from deserializeUser
    //in passport.js. the variable name 'req.user' cannot be changed because it's
    //in the API. From this object only the data needed is passed to frontend

    // in req.user there's company _id,company shortname, and the object user(logged in)
    var idCompanyAndUser = req.user;
    userGlobal = idCompanyAndUser.user;
    shortnameGlobal = idCompanyAndUser.company_shortname;

    //creating an object to be used in the frontend
    // userGlobal = {
    //   _id: user._id,
    //   username: user.username,
    //   //not showing the pass
    //   name: user.name,
    //   surname: user.surname,
    //   location: user.location,
    //   image: user.image,
    //   id_access_level: user.id_access_level,
    //   company_name: companyAndUser.name,
    //   company_shortname: companyAndUser.shortname,
    //   company_id: companyAndUser._id
    // };

    console.log('userGlobal in index : ' + JSON.stringify(userGlobal, null, 4));

    //the entire object user,with all their properties, is passed through a POST, and saved in 'req'
    res.render('index', {
        title: 'Eye 4 Task',
        header: 'Eye4Task live streaming',
        share: 'Share this link',
        footer: 'www.headapp.eu',
        idCompanyAndUser: idCompanyAndUser,
        shortnameGlobal: shortnameGlobal
    });
};

    /* Routes */

    //Gets and sets
    app.get('/api/getPrenotations/', getPrenotations);
    app.post('/api/addPrenotation/', addPrenotation);
    app.post('/api/findroom/', findRoom);
   // app.post('/api/addUser/', addUser);
    app.post('/api/addAula/', addAula);

    app.get('/login', login);
    app.post('/login', doLogin);
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
        console.log('logging out');
    });

    //Control panel
   // app.post('/api/createUser', isLoggedIn, createUser);
    app.post('/api/createUser', createUser);



    //Main
    app.get('/:id', isLoggedIn, index);
    app.get('/', isLoggedIn, index);

};

function isLoggedIn(req, res, next) {
    console.log('isLoggedIn, utente corrente: ' + JSON.stringify(req.user, null, 4));
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }
    // if they aren't redirect them to the home page
    res.redirect('/login');
}

function isAdmin(req, res, next) {
    console.log('isAdmin: ' + JSON.stringify(req.user, null, 4));
    var user = req.user.user;
    // if user is authenticated in the session, carry on
    if (user.access_level == 0 || user.access_level == 1) {
        return next();
    }
    // if they aren't redirect them to the home page
    else {
        console.log('User is not Admin: access_level is ' + user.access_level);
        res.redirect('/');
    }
}