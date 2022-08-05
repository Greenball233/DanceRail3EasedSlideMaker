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
const notesTypes = [ // [Start, Center, End, IsContinued]
    [5, 6, 7, true],
    [3, 11, 4, true],
    [10, 17, 18, true],
    [5, 19, 20, true],
    [5, 21, 22, true],
    [5, 23, 24, true],
    [5, 5, 5, false],
    [3, 3, 3, false],
    [10, 10, 10, false],
    [1, 1, 1, false],
    [2, 2, 2, false],
    [13, 13, 13, false],
    [14, 14, 14, false],
    [15, 15, 15, false],
    [16, 16, 16, false],
    [9, 9, 9, false]
]
const typesNotes = {
    7: 0,
    6: 0,
    4: 1,
    11: 1,
    18: 2,
    17: 2,
    20: 3,
    19: 3,
    22: 4,
    21: 4,
    24: 5,
    23: 5,
    5: 6,
    3: 7,
    10: 8,
    1: 9,
    2: 10,
    13: 11,
    14: 12,
    15: 13,
    16: 14,
    9: 15
}
hintBackground = document.getElementById("hint-background");
hintcontainer = document.getElementById("hint-container");
hint = document.getElementById("hint");
output = document.getElementById("output");
startButton = document.getElementById("start");
outputFirstNote = document.getElementById("output-first-note");
isCenter = document.getElementById("is-center");
startNote = document.getElementById("start-note");
endNote = document.getElementById("end-note");
startWithNote = document.getElementById("start-with-note");
outputStartAndEnd = document.getElementById("output-start-and-end");

easing = document.getElementById("easing");
noteWidth = document.getElementById("note-width");
xStart = document.getElementById("x-start");
xEnd = document.getElementById("x-end");
yStart = document.getElementById("y-start");
yEnd = document.getElementById("y-end");
noteType = document.getElementById("note-type");
noteSubdivition = document.getElementById("subdivision");
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
startWithNote.addEventListener("click", startWithNotes)
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
    let outputFirstNoteValue = outputFirstNote.checked;
    let isCenterValue = isCenter.checked;
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
        if (!(outputFirstNoteValue === false && j === 0)) {
            stringBuilder.append(noteBuilder([
                i,
                (j === 0) ? noteTypes[0] : ((j !== subdivision || isCenterValue) ? noteTypes[1] : noteTypes[2]),
                ((yEndValue - yStartValue) * j / subdivision + yStartValue).toFixed(5),
                xPos,
                noteWidthValue,
                (j === 0) ? 1 : 0,
                (j === 0 || !noteTypes[3]) ? 0 : i - 1
            ]));
        }
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

function startWithNotes() {
    let startNoteRaw = startNote.value;
    let endNoteRaw = endNote.value;
    startNote.disabled = true;
    endNote.disabled = true;
    let startNoteArgs = parseNote(startNoteRaw);
    let endNoteArgs = parseNote(endNoteRaw);
    if (startNoteArgs.length < 7) {
        output.value = "错误: 起始note不合法";
    }
    if (endNoteArgs.length < 7) {
        output.value = "错误: 终止note不合法";
    }
    let stringBuilder = new StringBuilder();
    let noteTypes = notesTypes[typesNotes[endNoteArgs[1]]];
    let outputStartAndEndValue = outputStartAndEnd.checked;
    let i = parseInt(startNoteArgs[0]) + (outputStartAndEndValue ? 10000 : 0);
    let xStartValue = parseFloat(startNoteArgs[3]);
    let xEndValue = parseFloat(endNoteArgs[3]);
    let yStartValue = parseFloat(startNoteArgs[2]);
    let yEndValue = parseFloat(endNoteArgs[2]);
    let easingId = parseInt(easing.value);
    let subdivision = parseInt(noteSubdivition.value);
    let noteWidthValue = parseFloat(startNoteArgs[4]);
    if (yStartValue >= yEndValue) {
        output.value = "错误：开始时间大于等于结束时间";
        return;
    }
    if (!outputStartAndEndValue) stringBuilder.append(startNoteRaw);
    for (let j = 0; j <= subdivision; j++) {
        if (j !== subdivision && j !== 0) {
            let xPos = lerp(xStartValue, xEndValue, easingId, j / subdivision).toFixed(2);
            stringBuilder.append(noteBuilder([
                i,
                noteTypes[1],
                ((yEndValue - yStartValue) * j / subdivision + yStartValue).toFixed(5),
                xPos,
                noteWidthValue,
                1,
                (!noteTypes[3]) ? 0 : ((j === 1) ? startNoteArgs[0] : i - 1)
            ]));
        } else if (j === subdivision && !outputStartAndEndValue) {
            endNoteArgs[6] = i - 1;
            stringBuilder.append(noteBuilder(endNoteArgs));
        }
        i++;
    }
    output.value = stringBuilder.toString();
    startNote.disabled = false;
    endNote.disabled = false;
}

function parseNote(raw) {
    return raw.replaceAll(">", "").substring(1).split("<")
}

function lerp(a, b, easingId, pos) {
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