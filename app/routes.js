var Instruction = require('./../models/instruction');
var Company = require('./../models/companies');
var User = require('./../models/users');
var Alert = require('./../models/alert');
var Qrcode = require('./../models/qrcode');
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

    // use mongoose to get last 5 instructions inserted in the databaser selected by id
    var getInstructionsbyid = function(req, res) {
        var id = req.params.operator_id;
        // console.log("user id instruction " + id);
        // id = "operatore01";
        Instruction.find({
                operator: id
            })
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
                roomId: req.body.id,
                username: req.body.user,
                tipology: req.body.tipology
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
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null),
            name: req.body.firstName,
            surname: req.body.lastName,
            phone: req.body.phoneNumber,
            location: req.body.location,
            image: '/home/',
            id_access_level: 2 //req.body.id_access_level
        });

        //first, I find the company in which add the user
        Company.findOne({
                '_id': req.user.company_id
            })
            .exec(
                function(err, company) {
                    if (err) res.status(500).send(err);

                    //then, I insert the newUser
                    company.users.push(newUser);
                    //and I save the modified document
                    company.save(function(err) {
                        if (err) {
                            console.log("This user already exists in your company. " + err);
                            res.status(500).send(err);
                        } else {
                            console.log('User added successfully!');
                            getUsersByCompany(req, res);
                        }
                    });

                    // res.json(company.users);
                });


    }; //end createUser

    //UPDATE: update an existing user
    var updateUser = function(req, res) {
        //req.user contains the data of the company and all their users,
        //req.body contains the data passed from administration controller (fields edited)
        console.log('fieldsEdited in routes.js: ' + JSON.stringify(req.body, null, 4));
        console.log('user logged: ' + JSON.stringify(req.user, null, 4));
        console.log('req.body._id :' + req.body._id);

        var partialUpdate = req.body;
        var set = {};
        for (var field in partialUpdate) {
            set['users.$.' + field] = partialUpdate[field];
        }

        Company.findOneAndUpdate({

                '_id': req.user.company_id,
                "users._id": req.body._id
            }, { $set: set }, { passRawResult: true },
            function(err, numAffected, res) {

                //console.log('Company updated: ' + JSON.stringify(numAffected, null, 4));
                //console.log('res is: ' + JSON.stringify(res, null, 4));
                console.log("number of users updated: " + res.ok);
            });
    }; //end updateUser

    //DELETE: remove existing user
    var removeUser = function(req, res) {
        //console.log("user selezionato per l'eliminazione: " + JSON.stringify(req.body, null, 4));
        //req.user contains company_shortname,company_id,and the logged user(in req.user.user)
        var company_id = req.user.company_id;

        Company.findOne({
                '_id': req.user.company_id
            },
            function(err, company) {

                //delete old document
                company.users.id(req.body._id).remove();

                company.save(function(err) {
                    if (err) {
                        return handleError(err);
                    }
                    getUsersByCompany(req, res);
                    console.log('the sub-doc was removed.')
                });
            }); //end findOne
    }; //end removeUser

   // process the login form
    var doLogin = passport.authenticate('local-login', {
        successRedirect: '/', // redirect to the secure profile section
        //successRedirect: '/HSCindex'
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    });

    var getfile = function(req, res) {
        var options = {
            root: __dirname, // + '/public/',
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        };

        var fileName = 'Eye4Task_User_Guide_standard.pdf';
        res.sendFile(fileName, options, function(err) {
            if (err) {
                console.log('error' + err);
            } else {
                console.log('Sent:', fileName);
            }
        });


    }

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
    

    app.get('/login', login);
    app.post('/login', doLogin);
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
        console.log('logging out');
    });

    //Control panel
    app.post('/api/createUser', isLoggedIn, createUser);
    app.post('/api/updateUser', isLoggedIn, updateUser);
    app.post('/api/removeUser', isLoggedIn, removeUser);




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
    if (user.id_access_level == 0 || user.id_access_level == 1) {
        return next();
    }
    // if they aren't redirect them to the home page
    else {
        console.log('User is not Admin: access_level is ' + user.id_access_level);
        res.redirect('/');
    }
}