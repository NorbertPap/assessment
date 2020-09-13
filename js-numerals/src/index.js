import {getWrittenNumber} from "./writeNumber.js";

function main() {
    let writeOutButton = document.getElementById("writeOutButton");

    writeOutButton.addEventListener("click", () => {
        let resultDiv = document.getElementById("result");
        resultDiv.innerText = getWrittenNumber();
    })
}

main();