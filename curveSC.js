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

class SCItem {
    sc = 0.00;
    sci = 0.000;

    constructor(sc, sci) {
        this.sc = parseFloat(sc).toFixed(2);
        this.sci = parseFloat(sci).toFixed(3);
    }
}

let scList = [];
input = document.getElementById("input");
inputParse = document.getElementById("input-parse");
scTable = document.getElementById("serialized-sc-table");
inputParse.addEventListener('click', parseSCTable)

function parseSCTable() {
    let rawList = input.value.replaceAll("\r", "").split("\n");
    let SCCount = 0;
    let SCList = [];
    let SCIList = [];
    let hasSCN = false;
    for (const rawSC of rawList) {
        if (rawSC.startsWith("#SCN")) {
            if (hasSCN) {
                alert("检测到多条#SCN语句，请检查输入是否正确");
                return;
            }
            hasSCN = true;
            SCCount = parseInt(rawSC.substring(5, rawSC.length - 1));
        }
        if (rawSC.startsWith("#SC ")) {
            let position = parseInt(rawSC.substring(rawSC.indexOf("[") + 1, rawSC.lastIndexOf("]")));
            if (SCList[position] !== undefined && SCList[position] !== null) {
                alert("检测到多条位于" + position + "的SC语句，请检查输入是否正确");
                return;
            }
            SCList[position] = parseFloat(rawSC.substring(rawSC.indexOf("=") + 1, rawSC.length - 1)).toFixed(2);
        }
        if (rawSC.startsWith("#SCI")) {
            let position = parseInt(rawSC.substring(rawSC.indexOf("[") + 1, rawSC.lastIndexOf("]")));
            if (SCIList[position] !== undefined && SCIList[position] !== null) {
                alert("检测到多条位于" + position + "的SCI语句，请检查输入是否正确");
                return;
            }
            SCIList[position] = parseFloat(rawSC.substring(rawSC.indexOf("=") + 1, rawSC.length - 1)).toFixed(3);
        }
    }
    if (!hasSCN) {
        alert("没有找到任何#SCN语句，请检查输入是否正确");
        return;
    }
    if (SCIList.length !== SCList.length) {
        alert("输入的#SC语句总数与#SCI语句总数不符，请检查输入是否正确");
        return;
    }
    if (SCList.length !== SCCount) {
        alert("输入的#SC和#SCI语句总数与#SCN的值不符，请检查输入是否正确");
        return;
    }
    for (let i = 0; i < SCList.length; i++) {
        if (SCList[i] === null) {
            alert("语句#SC[" + i + "]未找到，请检查输入是否正确");
            return;
        }
        if (SCIList[i] === null) {
            alert("语句#SCI[" + i + "]未找到，请检查输入是否正确");
            return;
        }
        scList[i] = new SCItem(SCList[i], SCIList[i]);
    }
    createTable();
}
function cleanTable() {
    //tableContainer.classList.add("hidden");
    scTable.innerHTML = "";
    let insertTr = scTable.insertRow(0);
    insertTr.innerHTML =
        "<tr>\n" +
        "    <th>进行插值</th>\n" +
        "    <th>SCI</th>\n" +
        "    <th>SC</th>\n" +
        "    <th>缓动编号</th>\n" +
        "    <th>拟合精度</th>\n" +
        "</tr>";
}
function copySCItem(self) {
    return new SCItem(self.sc, self.sci);
}
function createTable() {
    cleanTable();
    scList.sort(compareSCI);
    for (let i = 0; i < scList.length; i++) {
        let qwq = scList[i];
        if (qwq == null) {
            cleanTable();
            return false;
        }
        let insertTr = scTable.insertRow(i + 1);
        let insertTable = insertTr.insertCell(0)
        insertTable.innerHTML = "<input type='checkbox' id='is-ticked-" + i + "'>"
        let insertSCI = insertTr.insertCell(1);
        insertSCI.innerHTML = qwq.sci;
        let insertSC = insertTr.insertCell(2);
        insertSC.innerHTML = qwq.sc;
        let insertEase = insertTr.insertCell(3);
        insertEase.innerHTML = "<input type='number' value='1' step='1' id='ease-" + i + "'>";
        let temp = document.getElementById("ease-" + i);
        temp.addEventListener("input", function () {
            if (this.value > 29) this.value = 29;
            if (this.value < 1) this.value = 1;
        });
        let insertSubdivision = insertTr.insertCell(4);
        insertSubdivision.innerHTML = "<input type='number' value='1' step='1' id='subdivision-" + i + "'>";
        let temp2 = document.getElementById("subdivision-" + i)
        temp2.addEventListener("input", function () {
            if (this.value < 1) this.value = 1;
        });
    }
    tableContainer.classList.remove("hidden");
    return true;
}
function compareSCI(a, b) {
    return a.sci - b.sci;
}
function startLerp() {
    let tempList = [];
    for (let i = 0; i < scList.length; i++) {
        let isTicked = document.getElementById("is-ticked-" + i).checked;
        let isTickedNext = (i < (scList.length - 1)) ? document.getElementById("is-ticked-" + (i + 1)).checked : false;
        if (isTicked && isTickedNext) {
            let ease = parseInt(document.getElementById("ease-" + i).value);
            let subdivision = parseInt(document.getElementById("subdivision-" + i).value);
            tempList.push(copySCItem(scList[i]))
            for (let j = 1;j < subdivision;j++) {
                let newSc = lerp(scList[i].sc, scList[i+1].sc, ease, j / subdivision).toFixed(2);
                console.log(newSc);
                tempList.push(new SCItem(newSc, (scList[i+1].sci - scList[i].sci) * j / subdivision + scList[i].sci));
            }
        } else {
            tempList.push(copySCItem(scList[i]));
        }
    }
    scList = tempList;
    console.log(tempList);
    createTable();
}
function lerp(a, b, easingId, pos) {
    return tween[easingId](pos) * (b - a) + a;
}
tableContainer = document.getElementById("serialized-table-container");
hintBackground = document.getElementById("hint-background");
hintcontainer = document.getElementById("hint-container");
hint = document.getElementById("hint");
hintBackground.addEventListener("click", function () {
    hintBackground.classList.add("hidden");
    hintcontainer.classList.add("hidden");
});
hint.addEventListener("click", function () {
    hintBackground.classList.remove("hidden");
    hintcontainer.classList.remove("hidden");
});