
// Disable stop button while not recording

disableStop();

function disableStop() {
  stop.classList.add("inactive");
}

function enableStop() {
  stop.classList.remove("inactive");
}

function disableRecord() {
  record.classList.add("inactive");
}

function enableRecord() {
  record.classList.remove("inactive");
}



// Visualiser setup - create web audio api context and canvas
let audioCtx;
const canvasCtx = canvas.getContext("2d");

// Main block for doing the audio recording
if (navigator.mediaDevices.getUserMedia) {
  console.log("The mediaDevices.getUserMedia() method is supported.");

  const constraints = { audio: true };
  let chunks = [];

  let onSuccess = function (stream) {
    const mediaRecorder = new MediaRecorder(stream);

    visualize(stream);

    record.onclick = function () {
      mediaRecorder.start();
      console.log(mediaRecorder.state);
      console.log("Recorder started.");
      record.style.background = "red";

      disableRecord();
      enableStop();
      stop.classList.add("recording-btn")
    };

    stop.onclick = function () {
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
      console.log("Recorder stopped.");
      record.style.background = "";
      record.style.color = "";

      record.classList.remove("inactive");
      stop.classList.remove("recording-btn");
      disableStop();
    };

    mediaRecorder.onstop = function (e) {
      console.log("Last data to read (after MediaRecorder.stop() called).");

      const clipName = prompt(
        "Enter a name for your sound clip?",
        "My unnamed clip"
      );

      const clipContainer = document.createElement("div");
      const clipLabel = document.createElement("p");
      const audio = document.createElement("audio");
      const infoContainer = document.createElement("div");
      const buttonsContainer = document.createElement('div');
      const uploadButton = document.createElement("button");
      const deleteButton = document.createElement("button");
      
      clipContainer.classList.add("voice-clip");
      infoContainer.classList.add('voice-clip-info_container')
      audio.setAttribute("controls", "");
      buttonsContainer.className = "voice-clip-buttons";
      uploadButton.textContent = "Upload";
      uploadButton.className = "voice-upload-btn btn"
      deleteButton.textContent = "Delete";
      deleteButton.className = "voice-delete-btn btn";

      if (clipName === null) {
        clipLabel.textContent = "My unnamed clip";
      } else {
        clipLabel.textContent = clipName;
      }

      buttonsContainer.appendChild(uploadButton);
      buttonsContainer.appendChild(deleteButton);
      infoContainer.appendChild(clipLabel);
      infoContainer.appendChild(buttonsContainer);
      clipContainer.appendChild(infoContainer);
      clipContainer.appendChild(audio);
      soundClips.appendChild(clipContainer);

      audio.controls = true;
      const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
      chunks = [];
      console.log("recorder stopped");
      const audioURL = window.URL.createObjectURL(blob);
      audio.src = audioURL;
      
      deleteButton.onclick = function (e) {
        e.target.closest(".voice-clip").remove();
      };

      uploadButton.onclick = () => handleUploadVoice(blob, clipName)

      clipLabel.onclick = function () {
        const existingName = clipLabel.textContent;
        const newClipName = prompt("Enter a new name for your sound clip?");
        if (newClipName === null) {
          clipLabel.textContent = existingName;
        } else {
          clipLabel.textContent = newClipName;
        }
      };
    };

    mediaRecorder.ondataavailable = function (e) {
      chunks.push(e.data);
    };
  };

  let onError = function (err) {
    console.log("The following error occured: " + err);
  };

  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
} else {
  console.log("MediaDevices.getUserMedia() not supported on your browser!");
}

function visualize(stream) {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }

  const source = audioCtx.createMediaStreamSource(stream);

  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);

  draw();

  function draw() {
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = "rgb(0, 0, 0)";
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = "rgb(250, 250, 250)";

    canvasCtx.beginPath();

    let sliceWidth = (WIDTH * 1.0) / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      let v = dataArray[i] / 128.0;
      let y = (v * HEIGHT) / 2;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
  }
}

function updateCanvaSize() {
  canvas.width = mainSection.offsetWidth;
}
window.onresize = updateCanvaSize;

// document.onload = updateCanvaSize

function handleUploadVoice(blob, name) {
  const formData = new FormData();
  formData.append('audioFile', blob, name);

  fetch("/upload/voice", {
      method: "POST",
      body: formData
  })
  .then(response => {
      console.log("Voice uploaded successfully :)");
      console.log("More data:", response                                    );
  })
  .catch(error => {
      console.error("Error uploading Video: ", error);
  })
}