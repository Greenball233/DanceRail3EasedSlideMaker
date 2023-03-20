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
const output = document.getElementById("output");
const startButton = document.getElementById("start");
const outputFirstNote = document.getElementById("output-first-note");
const isCenter = document.getElementById("is-center");
const startNote = document.getElementById("start-note");
const endNote = document.getElementById("end-note");
const startWithNote = document.getElementById("start-with-note");
const outputStartAndEnd = document.getElementById("output-start-and-end");

const easing = document.getElementById("easing");
const noteWidth = document.getElementById("note-width");
const xStart = document.getElementById("x-start");
const xEnd = document.getElementById("x-end");
const yStart = document.getElementById("y-start");
const yEnd = document.getElementById("y-end");
const noteType = document.getElementById("note-type");
const noteSubdivition = document.getElementById("subdivision");
const noteId = document.getElementById("note-id");
startButton.addEventListener("click", start);
startWithNote.addEventListener("click", startWithNotes)
noteWidth.addEventListener("input", function () {
    if (this.value < 0.5) this.value = 0.5;
});
noteId.addEventListener("input", function () {
    if (this.value < 0) this.value = 0;
    if (this.value === "") this.value = 10000;
});
xStart.addEventListener("input", function () {
    if (this.value === "") this.value = 0;
})
xEnd.addEventListener("input", function () {
    if (this.value === "") this.value = 0;
})
yStart.addEventListener("input", function () {
    if (this.value < 0 || this.value === "") this.value = 0;
})
yEnd.addEventListener("input", function () {
    if (this.value < 0 || this.value === "") this.value = 0;
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
    let easingId = easing.selectedIndex + 1;
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
    noteId.value = i.toString();
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
    let easingId = easing.selectedIndex + 1;
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
        } else if (!outputStartAndEndValue) {
            if (j === subdivision) {
                endNoteArgs[0] = i;
                endNoteArgs[6] = i - 1;
                stringBuilder.append(noteBuilder(endNoteArgs));
            }
        }
        i++;
    }
    output.value = stringBuilder.toString();
    startNote.value = endNoteRaw;
    endNote.value = "";
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