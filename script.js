const tween = [ //缓动，同PhiEditer
    function () {
        throw "never call 0";
    },
    (pos) => pos, //1
    (pos) => Math.sin((pos * Math.PI) / 2), //2
    (pos) => 1 - Math.cos((pos * Math.PI) / 2), //3
    (pos) => 1 - (pos - 1) ** 2, //4
    (pos) => pos ** 2, //5
    (pos) => (1 - Math.cos(pos * Math.PI)) / 2, //6
    (pos) => ((pos *= 2) < 1 ? pos ** 2 : -((pos - 2) ** 2 - 2)) / 2, //7
    (pos) => 1 + (pos - 1) ** 3, //8
    (pos) => pos ** 3, //9
    (pos) => 1 - (pos - 1) ** 4, //10
    (pos) => pos ** 4, //11
    (pos) => ((pos *= 2) < 1 ? pos ** 3 : (pos - 2) ** 3 + 2) / 2, //12
    (pos) => ((pos *= 2) < 1 ? pos ** 4 : -((pos - 2) ** 4 - 2)) / 2, //13
    (pos) => 1 + (pos - 1) ** 5, //14
    (pos) => pos ** 5, //15
    (pos) => 1 - 2 ** (-10 * pos), //16
    (pos) => 2 ** (10 * (pos - 1)), //17
    (pos) => Math.sqrt(1 - (pos - 1) ** 2), //18
    (pos) => 1 - Math.sqrt(1 - pos ** 2), //19
    (pos) => (2.70158 * pos - 1) * (pos - 1) ** 2 + 1, //20
    (pos) => (2.70158 * pos - 1.70158) * pos ** 2, //21
    (pos) => ((pos *= 2) < 1 ? 1 - Math.sqrt(1 - pos ** 2) : Math.sqrt(1 - (pos - 2) ** 2) + 1) / 2, //22
    (pos) => (pos < 0.5 ? (14.379638 * pos - 5.189819) * pos ** 2 : (14.379638 * pos - 9.189819) * (pos - 1) ** 2 + 1), //23
    (pos) => 1 - 2 ** (-10 * pos) * Math.cos((pos * Math.PI) / 0.15), //24
    (pos) => 2 ** (10 * (pos - 1)) * Math.cos(((pos - 1) * Math.PI) / 0.15), //25
    (pos) => ((pos *= 11) < 4 ? pos ** 2 : pos < 8 ? (pos - 6) ** 2 + 12 : pos < 10 ? (pos - 9) ** 2 + 15 : (pos - 10.5) ** 2 + 15.75) / 16, //26
    (pos) => 1 - tween[26](1 - pos), //27
    (pos) => ((pos *= 2) < 1 ? tween[26](pos) / 2 : tween[27](pos - 1) / 2 + 0.5), //28
    (pos) => (pos < 0.5 ? 2 ** (20 * pos - 11) * Math.sin(((160 * pos + 1) * Math.PI) / 18) : 1 - 2 ** (9 - 20 * pos) * Math.sin(((160 * pos + 1) * Math.PI) / 18)) //29
];
const notesTypes = [
    [5, 6, 7],
    [3, 11, 4],
    [10, 17, 18],
    [5, 19, 20],
    [5, 21, 22],
    [5, 23, 24]
]
hintBackground = document.getElementById("hint-background");
hintcontainer = document.getElementById("hint-container");
hint = document.getElementById("hint");
output = document.getElementById("output");
startButton = document.getElementById("start");

easing = document.getElementById("easing");
noteWidth = document.getElementById("note-width");
xStart = document.getElementById("x-start");
xEnd = document.getElementById("x-end");
yStart = document.getElementById("y-start");
yEnd = document.getElementById("y-end");
noteType = document.getElementById("note-type");
noteSubdivition = document.getElementById("note-subdivision");
noteId = document.getElementById("note-id");
startButton.addEventListener("click", start);
easing.addEventListener("input", function () {
    if (this.value > 29) this.value = 29;
    if (this.value < 1) this.value = 1;
});
hintBackground.addEventListener("click", function () {
    hintBackground.classList.add("hidden");
    hintcontainer.classList.add("hidden");
});
hint.addEventListener("click", function () {
    hintBackground.classList.remove("hidden");
    hintcontainer.classList.remove("hidden");
});
noteWidth.addEventListener("input", function () {
    if (this.value < 0.5) this.value = 0.5;
});
noteId.addEventListener("input", function () {
    if (this.value < 0) this.value = 0;
});
yStart.addEventListener("input", function () {
    if (this.value < 0) this.value = 0;
})
yEnd.addEventListener("input", function () {
    if (this.value < 0) this.value = 0;
})
noteSubdivition.addEventListener("input", function () {
    if (this.value < 1) this.value = 1;
});

function start() {
    let stringBuilder = new StringBuilder();
    let noteTypes = notesTypes[noteType.selectedIndex];
    let i = parseInt(noteId.value);
    let xStartValue = parseFloat(xStart.value);
    let xEndValue = parseFloat(xEnd.value);
    let yStartValue = parseFloat(yStart.value);
    let yEndValue = parseFloat(yEnd.value);
    let easingId = parseInt(easing.value);
    let subdivision = parseInt(noteSubdivition.value);
    let noteWidthValue = parseFloat(noteWidth.value);
    if (yStartValue >= yEndValue) {
        output.value = "错误：开始时间大于等于结束时间";
        return;
    }
    easing.disabled = true;
    noteWidth.disabled = true;
    xStart.disabled = true;
    xEnd.disabled = true;
    yStart.disabled = true;
    yEnd.disabled = true;
    noteType.disabled = true;
    noteSubdivition.disabled = true;
    noteId.disabled = true;
    for (let j = 0; j <= subdivision; j++) {
        let xPos = lerp(xStartValue, xEndValue, easingId, j / subdivision).toFixed(2);
        stringBuilder.append(noteBuilder([
            i,
            (j === 0) ? noteTypes[0] : ((j === subdivision) ? noteTypes[2] : noteTypes[1]),
            ((yEndValue - yStartValue) * j / subdivision + yStartValue).toFixed(5),
            xPos,
            noteWidthValue,
            (j === 0) ? 1 : 0,
            (j === 0) ? 0 : i - 1
        ]));
        i++;
    }
    output.value = stringBuilder.toString();
    easing.disabled = false;
    noteWidth.disabled = false;
    xStart.disabled = false;
    xEnd.disabled = false;
    yStart.disabled = false;
    yEnd.disabled = false;
    noteType.disabled = false;
    noteSubdivition.disabled = false;
    noteId.disabled = false;
}

function lerp(a, b, easingId, pos) {
    console.log(typeof easingId);
    return tween[easingId](pos) * (b - a) + a;
}

function noteBuilder(args) {
    return "<" + args.join("><") + ">";
}

class StringBuilder {
    constructor() {
    }

    _stringArray = [];

    append(str) {
        this._stringArray.push(str);
    }

    toString() {
        return this._stringArray.join("\n");
    }
}