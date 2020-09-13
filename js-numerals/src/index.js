import {getWrittenNumber} from "./writeNumber.js";

function main() {
    let writeOutButton = document.getElementById("writeOutButton");

    writeOutButton.addEventListener("click", () => {
        let numberInput = document.getElementById("numberInput");
        let resultDiv = document.getElementById("result");
        resultDiv.innerText = getWrittenNumber(numberInput.value);
    })
}

main();