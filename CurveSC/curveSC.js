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
output = document.getElementById("output");
startLerpButton = document.getElementById("start-lerp");
generateButton = document.getElementById("generate");
scTable = document.getElementById("serialized-sc-table");
generateButton.addEventListener('click', parseSCListToSCTable)

function parseSCListToSCTable() {
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
        scList[i] = new SCItem(parseFloat(SCList[i]).toFixed(2), parseFloat(SCIList[i]).toFixed(3));
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
                tempList.push(new SCItem(newSc, (scList[i+1].sci - scList[i].sci) * j / subdivision + parseFloat(scList[i].sci)));
            }
        } else {
            tempList.push(copySCItem(scList[i]));
        }
    }
    scList = tempList;
    output.value = parseSCList(tempList);
    createTable();
}
function lerp(a, b, easingId, pos) {
    return tween[easingId](pos) * (parseFloat(b) - parseFloat(a)) + parseFloat(a);
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

function parseSCList(scList) {
    scList.sort(compareSCI);
    let stringBuilder = new StringBuilder();
    stringBuilder.append("#SCN=" + scList.length + ";");
    for (let i = 0; i < scList.length; i++) {
        stringBuilder.append("#SC [" + i + "]=" + parseFloat(scList[i].sc).toFixed(2) + ";");
        stringBuilder.append("#SCI[" + i + "]=" + parseFloat(scList[i].sci).toFixed(3) + ";");
    }
    return stringBuilder.toString();
}