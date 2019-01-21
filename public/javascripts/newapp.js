var app = angular.module('projectRtc', [],
    function($locationProvider) {
        $locationProvider.html5Mode(true);
    }
);

//activate-deactivate console.logS
var DEBUG = false;

//this is used for catching remote users disconnections
//check for socket.on leaveserver in app.controller
var socket = io();

//TODO risk
// define the ctrl
function statCtrl($scope) {

    // the last received msg
    $scope.msg = {};

    // handles the callback from the received event
    var handleCallback = function(msg) {
        $scope.$apply(function() {
            $scope.msg = JSON.parse(msg.data)
        });
    }

    var source = new EventSource('/api/operatorrisklevel');
    source.addEventListener('message', handleCallback, false);
}
//TODO end risk

//this global var is used to pass to scriptRecording.js the name of the operator
//e.g. 'operatore02'; this is used to create the div id of the video, used for recording needs.
var global_session_operator;

//not working
//var client = PeerManager.getInstance();

var map = {};

var mediaConfig = {
    audio: true,
    video: false
};

/*
to stream video, use this:
video: {
  mandatory: {},
  optional: []
}
*/

/*Enable and disable buttons*/
var disableRingOff = function() {
    var ringOff = document.getElementById('ringOff');
    ringOff.disabled = true;
    //disable hover color
    ringOff.classList.remove('btn-lg');
    ringOff.classList.add('btn-lg-disabled');
}

var enableRingOff = function() {
    var ringOff = document.getElementById('ringOff');
    ringOff.disabled = false;
    //enable hover color
    ringOff.classList.remove('btn-lg-disabled');
    ringOff.classList.add('btn-lg');
}

var disablePause = function() {
    var pauseButton = document.getElementById('pause');
    pause.disabled = true;
    //disable hover color
    pauseButton.classList.remove('btn-lg');
    pauseButton.classList.add('btn-lg-disabled');
}

var enablePause = function() {
    var pauseButton = document.getElementById('pause');
    pause.disabled = false;
    //enable hover color
    pauseButton.classList.remove('btn-lg-disabled');
    pauseButton.classList.add('btn-lg');
}

var disableCallButtons = function() {
    //disable all 'call' buttons

    var callButtons = document.getElementsByName('call-deactivate');
    for (var i = 0; i < callButtons.length; i++) {
        callButtons[i].disabled = true;
        //disable hover color
        callButtons[i].classList.remove('btn-lg');
        callButtons[i].classList.add('btn-lg-disabled');
    }
    console.log('callButtons disabled');

}

var enableCallButtons = function() {
    //disable all 'call' buttons
    var callButtons = document.getElementsByName('call-deactivate');
    for (var i = 0; i < callButtons.length; i++) {
        callButtons[i].disabled = false;
        //enable hover color
        callButtons[i].classList.remove('btn-lg-disabled');
        callButtons[i].classList.add('btn-lg');
    }
    console.log('callButtons enabled');
}

var disableViewButtons = function() {
    //deactivating 'view' buttons to avoid crash;
    //reactivation is in rtc.stop
    var viewButtons = document.getElementsByName('view-deactivate');
    for (var i = 0; i < viewButtons.length; i++) {
        viewButtons[i].disabled = true;
        //disable hover color
        viewButtons[i].classList.remove('btn-lg');
        viewButtons[i].classList.add('btn-lg-disabled');
    }
}

var enableViewButtons = function() {
    //reactivating 'view' buttons to avoid crash
    var viewButtons = document.getElementsByName('view-deactivate');
    for (var i = 0; i < viewButtons.length; i++) {
        viewButtons[i].disabled = false;
        //enable hover color
        viewButtons[i].classList.remove('btn-lg-disabled');
        viewButtons[i].classList.add('btn-lg');
    }
}

var disableChat = function() {
    var chatInput = document.getElementById('chat-input');
    var chatBtnSend = document.getElementById('chat-btn-send');
    chatInput.disabled = true;
    chatBtnSend.disabled = true;
    //disable hover color
    chatBtnSend.classList.remove('btn-lg');
    chatBtnSend.classList.add('btn-lg-disabled');
}

var enableChat = function() {
    var chatInput = document.getElementById('chat-input');
    var chatBtnSend = document.getElementById('chat-btn-send');
    chatInput.disabled = false;
    chatBtnSend.disabled = false;
    //enable hover color
    chatBtnSend.classList.remove('btn-lg-disabled');
    chatBtnSend.classList.add('btn-lg');
}

var hideOnCallDiv = function() {
    var onCallDiv = document.getElementsByName('oncall')[0];
    var offCallDiv = document.getElementsByName('offcall')[0];
    onCallDiv.style.display = 'none';
    offCallDiv.style.display = 'block';
}

var showOnCallDiv = function(operator) {
    //console.log('showOnCallDiv: lanciata');
    var onCallDiv = document.getElementsByName('oncall')[0];
    var offCallDiv = document.getElementsByName('offcall')[0];

    //console.log('showOnCallDiv: *'+operator+"*");
    if (global_session_operator == operator) {
        //console.log('show green, '+global_session_operator+", *"+operator+"*");
        onCallDiv.style.display = 'block';
        offCallDiv.style.display = 'none';

    } else {
        //console.log('hide green, '+global_session_operator+", *"+operator+"*");
        onCallDiv.style.display = 'none';
        offCallDiv.style.display = 'block';

    }
}

var loadBackgroud = function(user) {
    var back = document.getElementsByName('oncall')[0];
    offCallDiv.style.display = 'block';
}

//forward alert button
// var disableFwdAlert = function() {
//   var fwAlert = document.getElementById('fwAlert');
//   fwAlert.disabled = true;
//   //disable hover color
//   fwAlert.classList.remove('btn-lg');
//   fwAlert.classList.add('btn-lg-disabled');
// }
//
// var enableFwdAlert = function() {
//   var fwAlert = document.getElementById('fwAlert');
//   fwAlert.disabled = false;
//   //enable hover color
//   fwAlert.classList.remove('btn-lg-disabled');
//   fwAlert.classList.add('btn-lg');
// }

/*End enable and disable buttons*/


var mediaStreamObj;
app.factory('session', ['$rootScope', '$window', function($rootScope, $window) {
    var session = {};

    var user = {};
    //client = new PeerManager();
    // $http.get('/api/getLocalUserInfo/')
    //   .success(function(data) {
    //     user = data;
    //   });





    var mapDiv = $window.document.getElementById('map');
    map = new google.maps.Map(mapDiv, {
        center: {
            lat: 42.50,
            lng: 12.50
        },
        zoom: 6
    });
    session.preview = $window.document.getElementById('localVideo');




    session.start = function() {
        return requestUserMedia(mediaConfig)
            .then(function(localStream) {
                // attachMediaStream(session.preview, stream);
                // var el1 = document.getElementById("remoteVideosContainer");
                // if( document.getElementById("test") != undefined )
                //   el1.removeChild(document.getElementById("undefined"));
                //mediaStreamObj = stream;
                PeerManager.getInstance().setLocalStream(localStream);
                // session.stream = stream;
                session.localStream = localStream;
                $rootScope.$broadcast('cameraIsOn', true);

                //enable ringOff,pause,chat buttons
                enableRingOff();
                enablePause();
                enableChat();
                // enableFwdAlert();

            })
            .catch(Error('Failed to get access to local media.'));
    };

    var localUser = {};
    session.localStop = function() {
        return new Promise(function(resolve, reject) {
                try {
                    //session.stream.stop();
                    // for( var track in session.stream.getTracks() ) {
                    //   console.log(JSON.stringify(track,null,4));
                    //   track.stop();
                    // }
                    var audiotrack, videotrack;
                    session.localStream.getAudioTracks()
                        .forEach(function(audiotrack) {
                            audiotrack.stop();
                            console.log('local audio stopped');
                        });

                    session.localStream.getVideoTracks()
                        .forEach(function(videotrack) {
                            videotrack.stop();
                            console.log('local video stopped');
                        });

                    //session.preview.src = '';
                    resolve();
                } catch (error) {
                    reject(error);
                }
            })
            .then(function(result) {
                $rootScope.$broadcast('cameraIsOn', false);
            });
    };

    return session;
}]);

app.controller('RemoteStreamsController', ['session', '$location', '$http', '$scope', '$rootScope', '$window', '$interval', function(session, $location, $http, $scope, $rootScope, $window, $interval) {
    var rtc = this;
    var user = {};
    rtc.remoteStreams = [];
    //variable added by headapp
    rtc.filteredStreams = [];

    rtc.alerts = [];

    $http.get('/api/getLocalUserInfo').success(function(data) {
            user = data;
            console.log("newapp.js - User loggato: " + JSON.stringify(data, null, 4));
            session.localUser = data;
            // session.company_shortname = data.shortnameGlobal;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    //this catches users disconnections (from socketHandler.js) and fires rtc.stop.
    //This is useful for avoiding buttons not grayed off and crashes.
    //For 'leaveserver',search in socketHandler.js
    socket.on('leaveserver', function(id) {
        console.log('leaveserver received from id ' + id);

        //leaveserver received: this means that android client has been disconnected;
        //with this refresh, the android client name is removed from list.
        rtc.refreshButton();


        if (id == session.remoteStream.id) {
            //if recording is in progress, stop it.
            //recorder is an object that when is used is {} and when not is 'undefined'.
            try {
                if (recorder && recorder != undefined) stopRecording();
            } catch (err) {
                console.log('impossibile avviare stopRecording(). Errore: ' + err);
            }
            //after stopping recording, stop connection
            try {
                rtc.stop();
            } catch (err) {
                console.log('impossibile avviare rtc.stop(). Probabilmente non vi erano connessioni in corso. Errore: ' + err);
            }
        } //end if

    });

    socket.on('refreshlist', function() {
        rtc.loadData();
    });

    function getStreamById(id) {
        for (var i = 0; i < rtc.remoteStreams.length; i++) {
            if (rtc.remoteStreams[i].id === id) {
                return rtc.remoteStreams[i];
            }
        }
    }

    /*useful functions*/
    rtc.checkVariables = function() {
        console.log('remoteStreams è ' + JSON.stringify(rtc.remoteStreams, null, 4));
        console.log('client è ' + JSON.stringify(PeerManager.getInstance(), null, 4));
        console.log('session.remoteStream è ' + JSON.stringify(session.remoteStream, null, 4));
        console.log('rtc is ' + JSON.stringify(rtc, null, 4));
        console.log('session è ' + JSON.stringify(session, null, 4));
        //console.log("data è " + JSON.stringify(data, null, 4));

    }

    rtc.refreshButton = function() {
            console.log('refresh: lanciato');

            rtc.loadData();
            window.setTimeout(function() {
                //rtc.loadData();
                //if there is a call in progress, lock buttons
                if (document.getElementById(global_session_operator) != undefined) {
                    //disable all 'call' buttons
                    var callButtons = document.getElementsByName('call-deactivate');
                    for (var i = 0; i < callButtons.length; i++) {
                        callButtons[i].disabled = true;
                    }
                }
                //if there's no call,and no 'view' buttons have been clicked (at start or during call)
                //dont disabilitate any button

            }, 200);

            console.log('refresh: fine');
        }
        /*end of useful functions*/

    rtc.stop = function() {


        PeerManager.getInstance().peerEnd(session.remoteStream.id);
        //stopping recording if any
        try {
            //if recording is not already stopped
            if (recorder && recorder != undefined) {
                stopRecording();
            }
        } catch (err) {
            console.log('impossibile avviare stopRecording(). Probabilmente la registrazione è stata già interrotta. Errore: ' + err);
        }

        //stopping stream
        console.log('stopping...');

        //change button text: every button has the id depending from its operator name
        var callBtnId = 'btn-';
        callBtnId += global_session_operator;
        document.getElementById(callBtnId).textContent = "Disconnecting...";

        //stop checking every 10 seconds for connected operators(it causes issues with stop)
        $interval.cancel($scope.loopLoadData);

        //take 5 seconds to let the remote finish disconnecting, then make remote
        //callable again
        setTimeout(function() {
            //this re-enable the Call button (see table-streams.ejs)
            $scope.ngCallDisabled = false;
            //change button text from 'disconnecting' to 'call'
            //if no clients are available, just log it.
            try {
                document.getElementById(callBtnId).textContent = "Call";
            } catch (err) {
                console.log('No clients available now.');
            }
        }, 5000);

        //restart checking every 10 seconds for connected operators
        $scope.loopLoadData = $interval(rtc.loadData, 10000);

        //remove stream
        PeerManager.getInstance().removeRemoteStream(session.remoteStream.id);
        session.remoteStream.isPlaying = false;
        //rtc.remoteStreams.isPlaying = false;
        //session.stream.isPlaying = false;
        session.stream.id = null;
        session.stream.isStopped = true;

        /*MANAGING BUTTONS*/

        //disable chat-input and chat-button
        disableChat();
        //reactivating 'view' buttons to avoid crash
        enableViewButtons();
        //disable ringOff and pause buttons
        disableRingOff();
        disablePause();
        //hide green callee div
        hideOnCallDiv();

        // disableFwdAlert();
        /*END OF MANAGING BUTTONS*/

        //when a session is closed, we set the current session_operator to undefined;
        //useful in rtc.start to know if there is already a connection and if it is,to stop it.
        global_session_operator = undefined;

        /*this controls 'view' and 'call' button enabled/disabled through angular on table-streams.ejs*/
        //set ngCallDisabled to false when connection is stopped,means: is button disabled? false

        //set ngViewDisabled to false
        $scope.ngViewDisabled = false;


        console.log('...stopped.');
    };

    rtc.pause = function() {
        var divId = session.remoteStream.name;
        var remote = document.getElementById(divId);
        if (session.remoteStream.isPlaying == true) {
            remote.pause();
            session.remoteStream.isPlaying = false;
            //change button text
            document.getElementById('pause').textContent = "Resume";
        } else {
            remote.play();
            session.remoteStream.isPlaying = true;
            //change button text
            document.getElementById('pause').textContent = "Pause";
        }
    }

    rtc.loadData = function() {
        // get list of streams from the server
        $http.get('/streams.json').success(function(data) {
            rtc.filteredStreams= [];
            
            if (DEBUG) {
                console.log('rtc.loaddata in newapp.js - data is ' + JSON.stringify(data, null, 4));
            }


            // filter own stream
            var streams = data.filter(function(stream) {

                /*code added for calling from userinfo panel*/
                // session.stream = stream;
                // console.log('$rootScope.stream is '+ JSON.stringify($rootScope.stream, null, 4) );
                /*end of code added*/
                if (DEBUG) {
                    console.log('rtc.loaddata in newapp.js - stream is ' + JSON.stringify(stream, null, 4));
                    console.log('rtc.loaddata in newapp.js - server is ' + JSON.stringify(PeerManager.getInstance().getId(), null, 4));
                }
                return stream.id != PeerManager.getInstance().getId();
            });
            //now streams is an array with all streams but the ones from server
            //console.log("variabile streams: " + JSON.stringify(streams,null,4));
           
            // get former state
            for (var i = 0; i < streams.length; i++) {
                var stream = getStreamById(streams[i].id);
                streams[i].isPlaying = (!!stream) ? stream.isPLaying : false;

                if ( (streams[i].name).startsWith(session.localUser.company_shortname) ) {
                    rtc.filteredStreams.push(streams[i]);
                }
                //else console.log("if is false.");
            }
            //console.log("rtc.remoteStreams: "+JSON.stringify(rtc.remoteStreams,null,4)+" and rtc.filteredStreams: "+JSON.stringify(rtc.filteredStreams,null,4));
            
            // save new streams
            //rtc.remoteStreams = streams;
            rtc.remoteStreams = rtc.filteredStreams;
        })
    };

    rtc.loadAlerts = function() {
        // get list of streams from the server
        var config = {
            headers: {
                'Key': '123'
            }
        };
        $http.get('/api/getoperatorstatus', config).success(function(data) {

            //console.log('alerts ' + JSON.stringify(data, null, 4));
            // save new streams
            rtc.alerts = data;
            //console.log('alerts post set ' + JSON.stringify(rtc.alerts, null, 4));

        });
    };

    // (function(){
    // rtc.loadAlerts();
    //rtc.loadData();
    //setInterval(rtc.loadAlerts, 2000);
    //setInterval(rtc.loadData, 10000);
    // })();

    rtc.getRemoteUserInfo = function(remoteStream) {
        // console.log('getRemoteUserInfo: lanciata');
        //retrieving user clicked
        session.operator = remoteStream.name;
        session.remoteStream = remoteStream;
        session.stream = remoteStream;
        // console.log('getOpName eseguita: il nome operatore è ' + session.name);
        //retrieving data from db
        $http.get('/api/getremoteuser/' + session.operator)
            .success(function(data) {
                session.data = data;
                console.log('successo: fine ' + JSON.stringify(data, null, 4));
            })
            .error(function(data) {
                console.log('Error: data received from getremoteuser is ' + data);
            });
        //in $scope.on(loadopinfo) is launched also showOnCallDiv(), for managing the green div
        $scope.$broadcast('loadopinfo');
        // console.log('getRemoteUserInfo: fine ');

        //rtc.view(stream);
    }

    rtc.view = function(remoteStream) {

        session.operator = remoteStream.name;
        session.remoteStream = remoteStream;
        PeerManager.getInstance().peerInit(remoteStream.id);
        remoteStream.isPlaying = true;

        $scope.$broadcast('loadopinfo');
    };

    rtc.call = function(remoteStream) {
        //if there's already a call and this call is different from the one in progress, stop it before another call
        //  if (global_session_operator != undefined && global_session_operator != remoteStream.name) {
        //    rtc.stop();
        //  }

        //set ngCallDisabled to false when connection is playing,means: is button disabled? true
        $scope.ngCallDisabled = true;

        /*DEACTIVATING BUTTONS*/
        disableViewButtons();
        /*note: other buttons are disabled in session.start() function. This allows to gray them when the share camera/microphone
        question appears, before creating the connection.*/
        /*END DEACTIVATING BUTTONS*/

        //with this call, userinfo part of html (with map) is filled
        //this function must be called after the if(..) rtc.stop
        rtc.getRemoteUserInfo(remoteStream);

        /*this global var is used to pass stream.name to scriptRecording.js: needed for recording*/
        global_session_operator = remoteStream.name;

        //do connection stuff
        var stream = session.stream;
        console.log('call: stream.id=' + stream.id);
        if (stream.id == null || stream.id == undefined) {
            console.log('stream.id is null,setting stream;');
            stream = {
                id: stream,
                isPlaying: false
            };
            rtc.remoteStreams.push(stream);
            console.log('call: stream.id is now=' + JSON.stringify(stream.id, null, 4));
        }

        //set view button disabled while asking for microphone sharing
        $scope.ngViewDisabled = true;

        session.start()
            .then(function(result) {

                //re-enable view button after microphone sharing
                $scope.ngViewDisabled = false;


                if (stream.isPlaying) {
                    PeerManager.getInstance().peerRenegociate(stream.id);
                    console.log('2.peerRenegociate;');
                } else {
                    // client.peerRenegociate(stream.id);
                    PeerManager.getInstance().toggleLocalStream(stream.id);
                    PeerManager.getInstance().peerInit(stream.id);
                    console.log('3.peerInit;');
                    stream.isPlaying = true;
                }
                if (session.stream.isStopped) {
                    console.log('4.isStopped;');
                    //  client = new PeerManager();
                    // client.peerRenegociate(stream.id);
                    PeerManager.getInstance().peerInit(stream.id);
                    session.stream.isStopped = false;
                }
                //stream.isPlaying = !stream.isPlaying;
                console.log('5.stream.isPlaying;');
            })
            .catch(function(err) {
                console.log(err);
            });

        $scope.$broadcast('connected');

        var remoteVideoContainer = document.getElementById('remoteVideosContainer');
        var child;

        if (remoteVideoContainer.children.length > 0) {
            for (i = 0; i < remoteVideoContainer.children.length; i++) {

                child = remoteVideoContainer.childNodes[i];
                console.log("getAttribute(id) vale " + child.getAttribute('id'));
                if (child.getAttribute('id') != session.operator) {
                    child.style.display = 'none';
                } else {
                    child.style.display = 'block';
                }
            }

        }
    }; //end rtc.call()

    /* Pages Management */
    rtc.logout = function() {
        $http.get('/logout')
            .then(function() {
                location.reload();
            });
    }

    rtc.ctrlpanel = function() {
            $http.get('/ctrlpanel')
                .then(function() {
                    location.reload();
                });
        }
        /* End Pages Management */


    /*INITIAL LOAD*/
    //this var is used to enable/disable button call visibility(see table-streams.ejs, ng-disabled)
    $scope.ngCallDisabled = false;
    //this var is used to enable/disable view call visibility(see table-streams.ejs, ng-disabled)
    $scope.ngViewDisabled = false;
    rtc.loadData();

    //check for alerts and new operators continuously
    // rtc.loadAlerts();
    $scope.loopLoadAlerts = $interval(rtc.loadAlerts, 2000);
    $scope.loopLoadData = $interval(rtc.loadData, 10000);


    if ($location.url() != '/') {
        rtc.call($location.url().slice(1), 'refresh');
    };
    //during initial load, disable chat-input and chat-button
    disableChat();
    disableRingOff();
    disablePause();
    //during initial load, disable the 'oncall' green div
    hideOnCallDiv();

    // disableFwdAlert();

    /*ChatController*/
    $scope.formData = {};
    // when landing on the page, get all instructions and show them
    $scope.$on('connected',
        function() {
            //TODO enable chat
        });

    $scope.sendStatus = function(alert) {
        if (global_session_operator === undefined || global_session_operator == null) {
            return;
        }

        var id = JSON.stringify(alert._id, null, 4);
        var status = JSON.stringify(alert.textStatus, null, 4);
        var device = JSON.stringify(alert.device, null, 4);
        alert.text = id + ' ' + status + ' ' + device;
        // var    message = 'pippo';

        // console.log("messaggio" + message);
        $http.post('/api/postinstruction/' + session.operator, alert)
            .success(function(data) {
                $scope.instructions = data;
                console.log(data);
            })

        .error(function(data) {
            console.log('Error: ' + JSON.stringify(data, null, 4));
        });

    };

    // when submitting the add form, send the text to the node API
    $scope.createInstruction = function() {


        console.log($scope.formData);
        $http.post('/api/postinstruction/' + session.operator, $scope.formData)

        .success(function(data) {
            $scope.formData = {}; // clear the form so our user is ready to enter another
            $scope.instructions = data;
            console.log(data);
        })

        .error(function(data) {
            console.log('Error: ' + data);
        });
    };
    /*End ChatController*/

    /*userinfoController*/
    var stringanag = localStorage.getItem('local_user');
    console.log("localstorage user " + stringanag);
    $scope.local_user = JSON.parse(stringanag);

    $scope.$on('loadopinfo',
        function() {
            $scope.formData = {};
            $scope.instructions = {};
            $scope.user = {};

            $http.get('/api/getremoteuser/' + session.operator)
                .success(function(data) {
                    console.log("lo user è " + JSON.stringify(data, null, 4));
                    $scope.user = data;
                    console.log('global_session_operator == $scope.user.operator : ' + global_session_operator + ' / ' + JSON.stringify($scope.user, null, 4));
                    //show or hide green div
                    showOnCallDiv($scope.user.username);

                    //enable/disable ringoff, pause,green div
                    if (global_session_operator == $scope.user.username) {


                        //during connection, at start does not exist the video tag with id==global_session_operator
                        try {
                            var callerId = document.getElementById(global_session_operator).id;
                        } catch (err) {
                            console.log('note: document.getElementById(global_session_operator).id is null.');
                        }

                        //if name of video div is the same than the selected operator show chat,ringoff,pause
                        if (
                            (callerId) &&
                            (callerId != undefined) &&
                            (callerId == $scope.user.username)
                        ) {
                            enableChat();
                            enableRingOff();
                            enablePause();
                            // enableFwdAlert();
                        }
                        //this happens during connection
                        else {
                            console.log('primo else');
                            disableChat();
                        }

                    }
                    //this happens when connected switching between operators
                    else {
                        console.log('secondo else');
                        disableRingOff();
                        disablePause();
                        disableChat();
                        // disableFwdAlert();
                    }

                    var operatorPosition = {
                        lat: $scope.user.lat,
                        lng: $scope.user.lng
                    }
                    console.log("posizione " + JSON.stringify(operatorPosition, null, 4));
                    //
                    var marker = new google.maps.Marker({
                        position: operatorPosition,
                        map: map,
                        title: "torino"
                    });

                    map.panTo(marker.getPosition());
                    map.setZoom(14);

                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });



            $http.get('/api/getinstruction/' + session.operator)
                .success(function(data) {
                    // console.log("l'oggetto session è " + JSON.stringify(session, null, 4));
                    // console.log("l'oggetto data è " + JSON.stringify(data, null, 4));
                    $scope.instructions = data;
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });


            // var myLatLng = {
            //   lat: 45.0851397,
            //   lng: 7.6108084
            // };
        });
    /*end userinfoController*/

}]); //end RemoteStreamsController

/*
app.controller('LocalStreamController', ['session', '$scope', '$window', function(session, $scope, $window) {
    var localStream = this;
    localStream.name = 'Guest';
    localStream.link = '';
    localStream.cameraIsOn = false;

    $scope.$on('cameraIsOn', function(event, data) {
        $scope.$apply(function() {
            localStream.cameraIsOn = data;
        });
    });

    localStream.toggleCam = function() {
        if (localStream.cameraIsOn) {
            session.stop()
                .then(function(result) {
                    client.send('leaveserver');
                    client.setLocalStream(null);
                })
                .catch(function(err) {
                    console.log(err);
                });
        } else {
            session.start()
                .then(function(result) {
                    localStream.link = $window.location.host + '/' + client.getId();
                    client.send('readyToStream', {
                        name: localStream.name
                    });
                })
                .catch(function(err) {
                    console.log(err);
                });
        }
    };
}]);
*/