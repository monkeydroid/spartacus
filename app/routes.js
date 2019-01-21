var Instruction = require('./../models/instruction');
var Company = require('./../models/companies');
var User = require('./../models/users');
var Alert = require('./../models/alert');
var Qrcode = require('./../models/qrcode');
var passport = require('../public/controllers/passport');
var bcrypt = require('bcrypt-nodejs');
var util = util = require('util');

module.exports = function(app, passport, streams) {

    /* Things we need */
    //needed for reaching images and backgrounds;
    //if an image is in public/images/image.png, then use background url("images/image.png")
    var express = require('express');
    // var io = require('socket.io');
    var userGlobal = {};
    var shortnameGlobal = "";
    app.use(express.static('public'));

    /* Main Server Page */
    var getLocalUserInfo = function(req, res) {
        userGlobal.company_shortname = shortnameGlobal;
        console.log('userGlobal in getLocalUserInfo,routes.js :' + JSON.stringify(userGlobal, null, 4));
        //console.log('userGlobal in getLocalUserInfo,routes.js :' + JSON.stringify(userGlobal,null,4));

        // User.find({
        //     username: user.username
        // })
        // .exec(
        //   function(err, users) {
        //     if (err) res.status(500).send(err);
        //
        //     console.log("user nel getUserInfo " + JSON.stringify(user, null, 4));
        //     res.json(user);
        // });
        res.json(userGlobal);

    };

    // GET streams as JSON
    var displayStreams = function(req, res) {
        var streamList = streams.getStreams();
        // JSON exploit to clone streamList.public
        var data = (JSON.parse(JSON.stringify(streamList)));

        res.status(200).json(data);
    };

    /* Instructions (chat) Database */
    // use mongoose to get last 5 instructions inserted in the databasereq.params.todo_idreq.params.todo_id
    var getInstructions = function(req, res) {
        var id = req.params.operator_id;
        Instruction.find()
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
    var addInstruction = function(req, res) {
        console.log(JSON.stringify(req.params, null, 4));
        var time = new Date().getTime();
        var id = req.params.operator_id;

        Instruction.create({
                operator: id,
                text: req.body.text,
                date: time
            },
            function(err, instruction) {
                if (err) res.status(500).send(err);
                // get and return all the Instructions after you create another
                Instruction.find({
                        operator: id
                    })
                    .sort({
                        date: -1
                    })
                    .limit(8)
                    .exec(function(err, instructions) {
                        if (err)
                            res.status(500).send(err)

                        res.json(instructions);
                    });
                // Instruction.find(function(err, instructions) {
                //   if (err)
                //     res.status(500).send(err)
                //   res.json(instructions);

                // });
            }); //end function find

    }; //end function addInstruction
    /*End of Main Server Page*/

    /* Operator at risk */
    //create an alert/safe warning and insert it in the db
    var operatorRiskLevel = function(req, res) {
        var time = new Date().getTime();
        var id = req.params.operator_id;
        var status = parseInt(req.params.operator_status);
        var operator_status = "";
        switch (status) {
            case 100:
                operator_status = "safe";
                break;
            case 200:
                operator_status = "missing";
                break;
            case 300:
                operator_status = "alert";
                break;
        };

        var data = {
            "status": {
                "operator": id,
                "status": operator_status,
                "lat": req.params.operator_lat,
                "lon": req.params.operator_lon

            }
        };


        Alert.create({
                operator: id,
                status: status,
                textStatus: operator_status,
                lat: req.params.operator_lat,
                lon: req.params.operator_lon,
                date: time
            },
            function(err, alert) {
                if (err) {
                    res.status(500).send(err);
                }

                res.status(200).json(data);

            });
        // res.status(200).json(data);
    };

       //get alerts
    var getOperatorStatus = function(req, res) {

        // var key = req.get('Key');
        // console.log("chiave "+key);

        Alert.aggregate({
                $group: {
                    _id: "$operator",
                    status: {
                        "$last": "$status"
                    },
                    textStatus: {
                        "$last": "$textStatus"
                    },
                    device: {
                        "$last": "$device"
                    },
                    date: {
                        "$last": "$date"
                    },
                    lat: {
                        "$last": "$lat"
                    },
                    lon: {
                        "$last": "$lon"
                    }
                }
            }).sort({
                status: -1,
                _id: 1
            })
            .exec(
                function(err, alerts) {
                    if (err) res.status(500).send(err);
                    res.json(alerts);
                });
    };
    /* End of Operator at risk*/

    var getworkflow = function(req, res) {

        res.json({ "action": "call" });
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

    /* Administration: users management */
    //main page
    var administration = function(req, res) {
        console.log('administration: userGlobal(logged user) ' + JSON.stringify(userGlobal, null, 4));
        console.log("administration: company+user nella route(2fields+user logged) " + JSON.stringify(req.user, null, 4));
        res.render('administration', {
            title: 'back',
            user: JSON.stringify(req.user, null, 4), //stringified
            idCompanyAndUser: req.user //not stringified
        });
    };

    var insertQR = function(req, res) {

        var result = Qrcode.insertNewQR(req.body);
        console.log('result of insertQR is ' + result);
    };


    /* administration: CRUD */
    //READ: get all users by company_name
    var getUsersByCompany = function(req, res) {
        console.log('userGlobal qui ' + JSON.stringify(userGlobal, null, 4) + " e req.user " + JSON.stringify(req.user, null, 4));
        Company.findOne({
                '_id': req.user.company_id
            })
            .populate('users', '_id username name surname location image id_access_level')
            .exec(
                function(err, company) {
                    if (err) res.status(500).send(err);
                    console.log("company nel getUsersByCompany " + JSON.stringify(company, null, 4));
                    res.json(company.users);
                });
    }; //end getUsersByCompany

    var getUserByUsername = function(req, res) {
        //  console.log("getUserByUsername " + JSON.stringify(req.query, null, 4));
        if (req.query.username) {
            Company.findOne({
                    'users.username': req.query.username,
                })
                .select({ users: { $elemMatch: { "username": req.query.username } } })
                .exec(
                    function(err, company) {
                        if (err) res.status(500).send(err);
                        //console.log("company nel getuser " + JSON.stringify(company, null, 4));
                        if (company) return res.json(company.users[0]);
                        else return res.json(null);
                    });
        }
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

    //UPDATE: update an existing user
    var updateUserLocation = function(req, res) {
        //req.user contains the data of the company and all their users,
        //req.body contains the data passed from administration controller (fields edited)
        console.log('fieldsEdited in routes.js: ' + JSON.stringify(req.body, null, 4));
        console.log('user logged: ' + JSON.stringify(req.user, null, 4));
        console.log('req.body.username :' + req.body.username);

        var partialUpdate = req.body;
        var set = {};
        for (var field in partialUpdate) {
            set['users.$.' + field] = partialUpdate[field];
        }

        Company.findOneAndUpdate({
                "users.username": req.body.username
            }, { $set: set }, { passRawResult: true },
            function(err, numAffected, res) {

                //console.log('Company updated: ' + JSON.stringify(numAffected, null, 4));
                //console.log('res is: ' + JSON.stringify(res, null, 4));
                console.log("number of users updated: " + res.ok);
                return res.status(200).send("Thanks, operation successfully completed!");
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

    var updateByTelegramId = function(req, res) {
        var partialUpdate = req.body;
        console.log("aggiornamento action " + JSON.stringify(req.body, null, 4));
        var set = {};
        for (var field in partialUpdate) {
            set['users.$.' + field] = partialUpdate[field];
        }

        Company.findOneAndUpdate({
                "users.telegramChatId": req.body.telegramChatId
            }, { $set: set }, { new: true },
            function(err, company) {
                console.log('La company è: ' + JSON.stringify(company, null, 4));

                if (company == null) {
                    console.log("Error updating action: Company is null. Received error: " + err);
                    return res.status(404).send("Error inserting/updating user:\n" +
                        "no users found with this id.");
                } else if (err) {
                    console.log("Error: " + err);
                    return res.status(404).send("Error updating action");

                } else {
                    console.log('Action successfully inserted!' + JSON.stringify(company, null, 4));
                    return res.status(200).send("Thanks, operation successfully completed!");

                    // res.json({ company });
                }
            });
    }; //end updateOperator


    // process the login form
    var doLogin = passport.authenticate('local-login', {
        successRedirect: '/', // redirect to the secure profile section
        //successRedirect: '/HSCindex'
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    });

    // use mongoose to get the operator inserted in the database selected by id
    var getRemoteUserByOperatorName = function(req, res) {
        console.log('getRemoteUserByOperatorName - req.params: ' + JSON.stringify(req.params, null, 4)); //req.params.operator
        //console.log('getRemoteUserByOperatorName - req.body: '+JSON.stringify(req.body,null,4));
        console.log('getRemoteUserByOperatorName - req.user: ' + JSON.stringify(req.user, null, 4)); //logged user
        var user_operator = req.params.operator;

        Company.findOne({
                '_id': req.user.company_id,
                "users._id": req.user.user._id
            })
            .exec(function(err, company) {
                try {
                    console.log('companyfound: ' + JSON.stringify(company, null, 4));
                    for (i in company.users) {
                        if (company.users[i].username == user_operator) {
                            var userFound = company.users[i];
                            console.log('userFound: ' + JSON.stringify(userFound, null, 4));
                        }
                    }
                    res.json(userFound);
                } catch (err) {
                    console.log('Attenzione: errore in routes.js: company o username non trovati.\n' + err);
                }
            });
    };

    //Control Panel
    var ctrlpanel = function(req, res) {
        console.log('req.user in ctrlpanelroutes' + JSON.stringify(req.user, null, 4));
        res.render('ctrlpanel.ejs', {
            title: 'Eye 4 Task',
            idCompanyAndUser: req.user
        });
    };

    var findUserLoggedData = function(req, res) {
        User.find({
                operator: user.operator
            })
            .exec(
                function(err, user) {
                    if (err) {
                        res.status(500).send(err);
                    }
                    res.json(user);
                });

    };

    //user logged in page
    var logged = function(req, res) {
        res.render('profile.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    };

    /* Google Maps */
    //renders maps in main page
    var map = function(req, res) {
        res.render('map', {
            title: 'Eye 4 Task'
        });
    };


    var getCheckList = function(req, res) {
        var data = {
            "list": [
                { "check": "Check Radiator" },
                { "check": "Check Rotor" },
                { "check": "Check Voltage" },
                { "check": "Check Screws" }
            ]

        };
        data = "Safety\nResources\nPlanning/scheduling\nExecution\nSite Management\nWharehouse and spare parts\n" +
            "Wind Turbine\nMV/HV Substation\nScada & Control";
        return res.status(200).send(data);
    }

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

    /* Routes */

    //Gets and sets
    app.get('/api/getLocalUserInfo/', getLocalUserInfo);
    app.get('/map', map);
    app.get('/api/getinstruction/', getInstructions);
    app.get('/api/getinstruction/:operator_id', getInstructionsbyid);
    app.post('/api/postinstruction/:operator_id', addInstruction);
    app.get('/api/operatorrisklevel/:operator_id/:operator_status/:operator_lat/:operator_lon', operatorRiskLevel);
    app.get('/api/setoperatorstatus?', operatorRiskLevel2);
    app.get('/api/getoperatorstatus/', getOperatorStatus);
    app.get('/api/getfile', getfile);



    //Administration
    app.get('/administration', isLoggedIn, isAdmin, administration);
    app.get('/api/getusersbycompany/:company_name', getUsersByCompany);
    app.get('/api/getremoteuser/:operator', isLoggedIn, getRemoteUserByOperatorName);
    app.get('/streams.json', displayStreams);

    //Login
    //show the login form
    app.get('/login', login);
    //try to log in
    app.post('/login', doLogin);
    //logged in page
    // app.get('/profile', isLoggedIn, logged);
    //logout
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
        console.log('logging out');
    });

    //Control panel
    app.get('/ctrlpanel', isLoggedIn, ctrlpanel);
    app.get('/findUserLoggedData', isLoggedIn, findUserLoggedData);
    app.post('/api/createUser', isLoggedIn, createUser);
    app.post('/api/updateUser', isLoggedIn, updateUser);
    app.post('/api/updateuserlocation', updateUserLocation);
    app.post('/api/removeUser', isLoggedIn, removeUser);


    app.get('/api/insertQR', isLoggedIn, insertQR);

    //Telegram

    app.post('/api/checkphone', checkPhone);
    app.post('/api/settelegramchatid', setTelegramChatId);
    app.post('/api/updatebytelegramid', updateByTelegramId);
    app.get('/api/getworkflow', getworkflow);
    app.get('/api/getuserbyusername', getUserByUsername);
    app.get('/api/getchecklist', getCheckList);

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