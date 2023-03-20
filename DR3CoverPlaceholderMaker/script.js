const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("start-button");
const coverFileInput = document.getElementById("cover-file");
const songNameInput = document.getElementById("song-name");
const songArtistInput = document.getElementById("song-artist");
const downloadButton = document.getElementById("download");

window.addEventListener("load", () => {
    Preload();
    drawPlaceholder();
});

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
    ctx1.font = "70px HGR";
    ctx1.fillStyle = "#FFF";
    ctx1.textAlign = "center";
    ctx1.fillText(songNameInput.value, 256, 156);
    ctx1.save();
    ctx1.font = "60px HGR";
    ctx1.fillText(songArtistInput.value, 256, 356);
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
    ctx.font = "48px Arial";
    ctx.fillText(getPlaceholderText(document.documentElement.lang), canvas.width / 2, canvas.height / 2);
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