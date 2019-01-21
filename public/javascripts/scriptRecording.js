/*
More info at:
http://stackoverflow.com/questions/18509385/html-5-video-recording-and-storing-a-stream
*/

var videoRec, reqBtn, startBtn, stopBtn, ul, stream, recorder;
//videoRec = document.getElementById('operatore01');
//reqBtn = document.getElementById('request');
startBtn = document.getElementById('start');
stopBtn = document.getElementById('stop');
ul = document.getElementById('downloadlist');
//reqBtn.onclick = requestVideo;
startBtn.onclick = startRecording;
stopBtn.onclick = stopRecording;
startBtn.disabled = false;
ul.style.display = 'none';
stopBtn.disabled = true;

/*For requesting local webcam stream*/
// function requestVideo() {
//   navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true
//     })
//     .then(stm => {
//       stream = stm;
//       reqBtn.style.display = 'none';
//       startBtn.removeAttribute('disabled');
//       videoRec.src = URL.createObjectURL(stream);
//     }).catch(e => console.error(e));
// }

function startRecording() {
  /*global variable 'global_session_operator' passed here, created in newapp.js to get operator name*/

  //catching errors if start recording button is clicked
  //before estabilishing a connection and before selecting an operator
  try {
    videoRec = document.getElementById(global_session_operator);
    stream =  videoRec.srcObject;
    //console.log("stream "+JSON.stringify(stream,null,4));
    recorder = new MediaRecorder(stream);
    recorder.start();
    console.log('scriptRecording.js - startRecording : recording started!');
    //console.log('scriptRecording.js - startRecording : recording is'+JSON.stringify(recorder, null, 4));
    stopBtn.removeAttribute('disabled');
    startBtn.disabled = true;
  }
  catch (err) {
    if ( err == 'TypeError: videoRec is null') {
      console.log('Impossibile registrare : nessun operatore selezionato, o nessuna connessione avviata. Errore: ' + err);
    }
    //happens when server restarts but android client not
    if ( err == 'SecurityError: The operation is insecure.') {
      throw(err);
    }
  }
}


function stopRecording() {
  recorder.ondataavailable = e => {
    ul.style.display = 'block';
    var a = document.createElement('a'),
      li = document.createElement('li');
    a.download = [global_session_operator, (new Date() + '').slice(4, 28), '.webm'].join('');
    a.href = URL.createObjectURL(e.data);
    a.textContent = a.download;
    li.appendChild(a);
    ul.appendChild(li);
  };
  recorder.stop();
  console.log('scriptRecording.js - stopRecording : recording stopped!');
  startBtn.removeAttribute('disabled');
  stopBtn.disabled = true;
}
