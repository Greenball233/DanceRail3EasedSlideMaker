const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("start-button");
const coverFileInput = document.getElementById("cover-file");
const songNameInput = document.getElementById("song-name");
const songArtistInput = document.getElementById("song-artist");
const songNameSizeInput = document.getElementById("song-name-size");
const songArtistSizeInput = document.getElementById("song-artist-size");
const songNamePosInput = document.getElementById("song-name-pos");
const songArtistPosInput = document.getElementById("song-artist-pos");
const downloadButton = document.getElementById("download");

window.addEventListener("load", () => {
    Preload();
    drawPlaceholder();
});
songNameSizeInput.addEventListener("change", () => {
    if (songNameSizeInput.value === "") songNameSizeInput.value = 42;
    let number = parseInt(songNameSizeInput.value);
    if (number < 1) number = 1;
    songNameSizeInput.value = number.toString()
})

songArtistSizeInput.addEventListener("change", () => {
    if (songArtistSizeInput.value === "") songArtistSizeInput.value = 37;
    let number = parseInt(songArtistSizeInput.value);
    if (number < 1) number = 1;
    songArtistSizeInput.value = number.toString()
})

songNamePosInput.addEventListener("change", () => {
    if (songNamePosInput.value === "") songNamePosInput.value = 100;
})

songArtistPosInput.addEventListener("change", () => {
    if (songArtistPosInput.value === "") songArtistPosInput.value = 200;
})

startButton.addEventListener("click", draw);
downloadButton.addEventListener("click", download);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
}

function drawBackground() {
    let backgroundImage = new Image();
    backgroundImage.src = "./res/bg.png";
    backgroundImage.onload = function () {
        ctx.drawImage(backgroundImage, 0, 0);
        drawText();
    }
}


function drawText() {
    let textCanvas = document.createElement("canvas");
    textCanvas.height = canvas.height;
    textCanvas.width = canvas.width;
    let ctx1 = textCanvas.getContext("2d");
    ctx1.font = songNameSizeInput.value + "px HGR";
    ctx1.fillStyle = "#FFF";
    ctx1.textAlign = "center";
    ctx1.fillText(songNameInput.value, 150, parseFloat(songNamePosInput.value));
    ctx1.save();
    ctx1.font = songArtistSizeInput.value + "px HGR";
    ctx1.fillText(songArtistInput.value, 150, parseFloat(songArtistPosInput.value));
    let textImage = new Image();
    textImage.src = textCanvas.toDataURL("image/png");
    textImage.onload = function () {
        ctx.drawImage(textImage, 0, 0);
        textCanvas.remove();
    }
}

function Preload() {
    let textCanvas = document.createElement("canvas");
    textCanvas.height = canvas.height;
    textCanvas.width = canvas.width;
    let ctx1 = textCanvas.getContext("2d");
    ctx1.font = "1px HGR";
    ctx1.fillText('', 0, 0);
    textCanvas.remove();
}

function drawPlaceholder() {
    ctx.fillStyle = "#d3d3d3";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "#1f1e33";
    ctx.font = "28px Arial";
    ctx.fillText(getPlaceholderText(document.documentElement.lang), 150, 150);
}
function download() {
    const downloadElement = document.createElement("a");
    downloadElement.download = "歌曲封面_" + songNameInput.value + " by " + songArtistInput.value;
    downloadElement.href = canvas.toDataURL("image/png");
    document.body.appendChild(downloadElement);
    downloadElement.click();
    downloadElement.remove();
}
function getPlaceholderText(lang) {
    switch (lang) {
        case "zh":
            return "准备完毕，等待上传…";
        case "en":
            return "End for preparation, waiting…";
        case "ja":
            return "準備完了、アップロード待ち";
        default:
            return "End for preparation, waiting…";
    }
}