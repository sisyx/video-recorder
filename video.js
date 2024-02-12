const vrecord = document.querySelector(".video-record-btn");
const vpause = document.querySelector(".video-pause-btn");
const videoElm = document.querySelector(".video-element");
const finalVideoContainer = document.querySelector(".recorder-video-container");
const finalVideo = document.querySelector(".final-video");
const finalVideoUploadBtn = document.querySelector(".final-video-upload-btn");
const finalVideoDeleteBtn = document.querySelector(".final-video-delete-btn");

window.onload = async function () {
    const videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
    })

    const videoRecord = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
    })

    videoElm.srcObject = videoStream

    vrecord.addEventListener('click', () => {
        var mediaRecorder = new MediaRecorder(videoRecord);

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