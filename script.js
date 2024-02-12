// general scripts
// like: "header fucntions", "elements visiablity", etc

const voiceSection = document.querySelector(".voice-records");
const videoSection = document.querySelector(".video-records");
const uploadSection = document.querySelector(".upload-records");


function handleHeaderVoiceClick(event) {
    const activeBtn = document.querySelector(".active");

    // show / hide elements
    voiceSection.classList.remove('inactive');
    videoSection.classList.add('inactive');
    uploadSection.classList.add('inactive');

    // change header's active button
    activeBtn.classList.remove("active");
    event.target.classList.add('active')
}

function handleHeaderVideoClick(event) {
    const activeBtn = document.querySelector(".active");

    // show / hide elements
    videoSection.classList.remove('inactive');
    voiceSection.classList.add('inactive');
    uploadSection.classList.add('inactive');

    // change header's active button
    activeBtn.classList.remove("active");
    event.target.classList.add('active')
}

function handleHeaderUploadClick(event) {
    const activeBtn = document.querySelector(".active");

    // show / hide elements
    uploadSection.classList.remove('inactive');
    videoSection.classList.add('inactive');
    voiceSection.classList.add('inactive');

    // change header's active button
    activeBtn.classList.remove("active");
    event.target.classList.add('active')
}