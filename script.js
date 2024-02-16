// general scripts
// like: "header fucntions", "elements visiablity", etc

// global vars
const startBtn = document.querySelector(".first-popup .btn");
const startingPopup = document.querySelector('.first-popup')

// video vars
const vrecord = document.querySelector(".video-record-btn");
const vpause = document.querySelector(".video-pause-btn");
const videoElm = document.querySelector(".video-element");
const finalVideoContainer = document.querySelector(".recorder-video-container");
const finalVideo = document.querySelector(".final-video");
const finalVideoUploadBtn = document.querySelector(".final-video-upload-btn");
const finalVideoDeleteBtn = document.querySelector(".final-video-delete-btn");

let videoStream;
let videoRecord;
let mediaRecorder;

// voice vars
const record = document.querySelector(".record");
const stop = document.querySelector(".stop");
const soundClips = document.querySelector(".sound-clips");
const canvas = document.querySelector(".visualizer");
const mainSection = document.querySelector(".main-controls");



const voiceSection = document.querySelector(".voice-records");
const videoSection = document.querySelector(".video-records");


function handleHeaderVoiceClick(event) {
    const activeBtn = document.querySelector(".active");
    
    // show / hide elements
    voiceSection.classList.remove('inactive');
    videoSection.classList.add('inactive');
    
    // change header's active button
    activeBtn.classList.remove("active");
    event.target.classList.add('active')
    stopCamera();
    updateCanvaSize()
}

function handleHeaderVideoClick(event) {
    showVideoPart();
}

function showVideoPart() {
    startCamera()
    const activeBtn = document.querySelector(".active");

    // show / hide elements
    videoSection.classList.remove('inactive');
    voiceSection.classList.add('inactive');

    // change header's active button
    activeBtn.classList.remove("active");
    event.target.classList.add('active');
}