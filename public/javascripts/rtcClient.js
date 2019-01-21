// var _statistics = {
//   audio : 0,
//   video : 0,
//   instant_audio : 0,
//   instant_video : 0,
//   seconds : 0
// };

var PeerManager = (function() {

    var instance;

    function constructor() {

        var localId,
            config = {
                peerConnectionConfig: {
                    iceServers: [{
                            "username": "test",
                            "url": "turn:178.62.3.250",
                            "credential": "test"
                        },
                        {
                            "username": "test",
                            "url": "turn:192.168.1.7",
                            "credential": "test"
                        },
                        {
                            "url": "stun:23.21.150.121"
                        }, {
                            "url": "stun:stun.gmx.net"
                        }, {
                            "url": "stun:stun.l.google.com:19305"
                        }, {
                            "url": "stun:stun.l.google.com:19305"
                        }, {
                            "url": "stun:stun1.l.google.com:19305"
                        }, {
                            "url": "stun:stun2.l.google.com:19305"
                        }, {
                            "url": "stun:stun3.l.google.com:19305"
                        }, {
                            "url": "stun:stun4.l.google.com:19305"
                        }
                    ]
                },
                peerConnectionConstraints: {
                    optional: [{
                        "iceRestart": true,
                        "DtlsSrtpKeyAgreement": true
                    }]
                }
            },
            peerDatabase = {},
            localStream,
            remoteStream,
            sessionDescriptionTmp,
            remoteVideoContainer = document.getElementById('remoteVideosContainer'),
            socket = io();

        socket.on('message', handleMessage);
        socket.on('id', function(id) {
            localId = id;
        });

        // socket.on('leaveserver', function(id) {
        //   console.log('rtcClient: received '+id);
        //   // removeRemoteStream(id.msg);
        // });


        function addPeer(remoteId) {
            var peer = new Peer(config.peerConnectionConfig, config.peerConnectionConstraints);

            peer.pc.onicecandidate = function(event) {
                if (event.candidate) {
                    send('candidate', remoteId, {
                        label: event.candidate.sdpMLineIndex,
                        id: event.candidate.sdpMid,
                        candidate: event.candidate.candidate
                    });
                }
            };

            var refreshIntervalId;
            peer.pc.onaddstream = function(event) {

                peer.remoteVideoEl.setAttribute("id", event.stream.id);
                peer.remoteVideoEl.setAttribute("class", "remotevideo");
                // console.log("stream.name: "+event.stream.toString());
                attachMediaStream(peer.remoteVideoEl, event.stream);
                remoteVideosContainer.appendChild(peer.remoteVideoEl);
                //get statistics
                // getStats(peer.pc);
                //launch getStats every 1 sec : it is stopped on 'peer.pc.onremovestream' by the 'clearInterval' function
                // refreshIntervalId = setInterval(function () {
                // var statistics = new getStats(peer.pc);
                //console.log('statistiche: ' +_statistics.audio+' '+_statistics.video );
                // }, 1000);



            };

            peer.pc.onremovestream = function(event) {
                peer.remoteVideoEl.src = '';
                remoteVideosContainer.removeChild(peer.remoteVideoEl);
                clearInterval(refreshIntervalId);
            };

            peer.pc.oniceconnectionstatechange = function(event) {

                console.log("evento di stato " + event.target.iceConnectionState);
                switch (
                    (event.srcElement // Chrome
                        ||
                        event.target) // Firefox
                    .iceConnectionState) {
                    case 'left':
                    case 'failed':
                        remoteVideosContainer.removeChild(peer.remoteVideoEl);
                        break;
                }
            };
            peerDatabase[remoteId] = peer;

            return peer;
        } //end of addPeer

        function answer(remoteId) {
            var pc = peerDatabase[remoteId].pc;
            pc.createAnswer(
                function(sessionDescription) {
                    sessionDescriptionTmp = sessionDescription;
                    pc.setLocalDescription(sessionDescription);
                    send('answer', remoteId, sessionDescription);
                },
                error
            );
        }

        function offer(remoteId) {
            var pc = peerDatabase[remoteId].pc;
            pc.createOffer(
                function(sessionDescription) {
                    pc.setLocalDescription(sessionDescription);
                    send('offer', remoteId, sessionDescription);
                },
                error
            );
        }

        //new
        function remove(remoteId) {
            var pc = peerDatabase[remoteId].pc;


            send('left', remoteId, sessionDescriptionTmp);
            /*     pc.createOffer(
            function(sessionDescription) {
                pc.setLocalDescription(sessionDescription);
                send('leave', remoteId, sessionDescription);
            },
            error
        );

*/
        };
        //end new

        function handleMessage(message) {
            var type = message.type,
                from = message.from,
                pc = (
                    peerDatabase[from] ||
                    addPeer(from)).pc;

            console.log('received ' + type + ' from ' + from);

            switch (type) {
                case 'init':
                    toggleLocalStream(pc);
                    offer(from);
                    console.log("init");
                    break;
                case 'offer':
                    pc.setRemoteDescription(new RTCSessionDescription(message.payload), function() {}, error);
                    answer(from);
                    console.log("offer");
                    break;
                case 'answer':
                    pc.setRemoteDescription(new RTCSessionDescription(message.payload), function() {}, error);
                    console.log("answer");
                    break;
                case 'candidate':
                    if (pc.remoteDescription) {
                        pc.addIceCandidate(new RTCIceCandidate({
                            sdpMLineIndex: message.payload.label,
                            sdpMid: message.payload.id,
                            candidate: message.payload.candidate
                        }), function() {}, error);
                    }
                    break;
                case 'left':
                    console.log("leave in rtcClient.js");
                    socket.emit('left');
                    break;
            }
        }

        function send(type, to, payload) {
            console.log('sending ' + type + ' to ' + to);

            socket.emit('message', {
                to: to,
                type: type,
                payload: payload
            });
        }

        function toggleLocalStream(pc) {
            pc.addStream(localStream);
            console.log('1.toggleLocalStream;');
            // if (localStream) {
            //
            //   // (!!pc.getLocalStreams().length) ? pc.removeStream(localStream) : pc.addStream(localStream);
            //   if (!!pc.getLocalStreams().length) {
            //     Promise.all(pc.getSenders().map(sender =>
            //         sender.replaceTrack((sender.track.kind == "audio") ?
            //           localStream.getAudioTracks()[0] :
            //           localStream.getVideoTracks()[0])))
            //       .then(() => console.log("Flip!"));
            //       // .catch(err);
            //   } else pc.addStream(localStream);
            // } else {
            //   pc.removeStream(localStream);
            // }
        }

        function error(err) {
            console.log(err);
        }


        return {
            getId: function() {
                return localId;
            },

            setLocalStream: function(stream) {
                // if local cam has been stopped, remove it from all outgoing streams.
                if (!stream) {
                    for (id in peerDatabase) {
                        pc = peerDatabase[id].pc;
                        if (!!pc.getLocalStreams().length) {
                            pc.removeStream(localStream);
                            offer(id);
                        }
                    }
                }
                localStream = stream;
            },

            toggleLocalStream: function(remoteId) {
                peer = peerDatabase[remoteId] || addPeer(remoteId);
                toggleLocalStream(peer.pc);
            },

            peerInit: function(remoteId) {
                peer =
                    peerDatabase[remoteId] ||
                    addPeer(remoteId);
                send('init', remoteId, null);
            },
            peerEnd: function(remoteId) {
                remove(remoteId);
            },

            peerRenegociate: function(remoteId) {
                offer(remoteId);
            },

            send: function(type, payload) {
                socket.emit(type, payload);
            },

            removeRemoteStream: function(remoteId) {
                // send('leave', remoteId, null);
                peerDatabase[remoteId].pc.onremovestream();
                peerDatabase[remoteId].pc.close();
                ////console.log("Total bytes consumed for audio until now are: " + totalBytesConsumed);
                addPeer(remoteId);
            }

        };


    }
    return {
        getInstance: function() {

            if (!instance) { // check already exists
                instance = constructor();
            }
            return instance;
        }

    }

})();

var Peer = function(pcConfig, pcConstraints) {
    this.pc = new RTCPeerConnection(pcConfig, pcConstraints);
    this.remoteVideoEl = document.createElement('video');
    this.remoteVideoEl.controls = true;
    this.remoteVideoEl.autoplay = true;
}