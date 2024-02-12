
window.onload = async function () {
    videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
    })

    videoRecord = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
    })

    videoElm.srcObject = videoStream

    vrecord.addEventListener('click', () => {
        mediaRecorder = new MediaRecorder(videoRecord);

        let blob = [];
    
        mediaRecorder.addEventListener("dataavailable", (event) => {
            blob.push(event.data);
        })
    
        mediaRecorder.addEventListener('stop', (event) => {
            const videoLocal = URL.createObjectURL(new Blob(blob));
            finalVideo.src = videoLocal;

            finalVideoDeleteBtn.addEventListener("click", () => {
                delete videoLocal;
                finalVideo.src = "";
                hideFinalVideo();
            })

            finalVideoUploadBtn.addEventListener('click', () => handleUploadVideo(new Blob(blob)))

        })
    
        mediaRecorder.start();
        
        vpause.addEventListener('click', () => {
            mediaRecorder.stop()
            enableRecord();
            showFinalVideo();
        })

        disabelRecord();
    })


}

function disabelRecord() {
    vrecord.disabled = true;
}

function enableRecord() {
    vrecord.disabled = false;
}

function showFinalVideo() {
    finalVideoContainer.classList.remove('inactive');
}

function hideFinalVideo() {
    finalVideoContainer.classList.add('inactive');
}

function handleUploadVideo(blob) {
    // const blob = new Blob(chunks, { type: 'video/webm'})
    const formData = new FormData();
    formData.append('videoFile', blob, 'recorded_video.webm');

    fetch("/upload/video", {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (response.status == 200) {
            console.log("Video uploaded successfully :)");
        } else {
            console.error("Video Failed toupload \nMore data:", response);
        }
    })
    .catch(error => {
        console.error("Error uploading Video: ", error);
    })
}


async function stopCamera() {
    if (videoStream) {
        const tracks = videoStream.getTracks();
        tracks.forEach(track => track.stop())
        console.log("camera stoped");
    } else {
        console.log("camera didn't stop");
    }
}

async function startCamera() {
    videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
    });

    videoElm.srcObject = videoStream;
}