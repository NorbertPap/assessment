export const NOT_A_NUMBER_ERROR_TEXT = "Your input was not a number. Please write one into the input field if you want a correct result.";

/**
 * Converts any positive integer into it's written form in English
 * @param {string} input Accepts any type of input string, and decides if it's suitable for the task, i.e.: the input is a string representation of a number.
 * @return {string}      The message that should be displayed on the web page: if there's something wrong with the input, it returns an error message,
 *                       for actual numerical strings, it returns the written English form of the number.
 */
export function getWrittenNumber(input) {
    let stringToDisplay;

    if(isIncorrectNumberInput(input)) {
        stringToDisplay = NOT_A_NUMBER_ERROR_TEXT;
    } else {
        try {
            if(inputIsZero(input)) {
                stringToDisplay = "zero";
            } else {
                if(inputIsInteger(input)) {
                    stringToDisplay = writeInteger(input);
                } else {
                    let [integerPart, fractionalPart] = input.split(".");
                    stringToDisplay = joinIntegerAndFractionalParts(writeInteger(integerPart, Number.parseInt(fractionalPart) !== 0), writeFractional(fractionalPart));
                }
            }
        } catch (e) {
            stringToDisplay = e.message;
        }
    }

    return stringToDisplay;
}

function isIncorrectNumberInput(input) {
    let isIncorrectNumberInput = false;
    if(input === undefined || input === null || input === "") {
        isIncorrectNumberInput = true;
    } else if (input === "-" || input.indexOf("-") !== -1 && input.indexOf("-") !== 0 || input.split("-").length > 2) { // Incorrectly located, multiple or only minus signs
        isIncorrectNumberInput = true;
    } else if (input === "." || input.split(".").length > 2) { // Multiple decimal points, or only decimal point
        isIncorrectNumberInput = true;
    } else if (nonZeroLeadsWithZero(input)) {
        isIncorrectNumberInput = true;
    } else {
        for (let i = 0; i < input.length; i++) {
            if(isInvalidCharacter(input.charAt(i))) {
                isIncorrectNumberInput = true;
                break;
            }
        }
    }
    return isIncorrectNumberInput;
}

function nonZeroLeadsWithZero(input) {
    let hasIncorrectLeadingZero = false;
    input = (input.indexOf("-") === 0) ? input.substr(1) : input;
    let firstZeroIndex = input.indexOf("0");
    if(firstZeroIndex === 0) {
        if(input.length !== 1 && firstZeroIndex === 0 && input.charAt(1) !== ".") {
            hasIncorrectLeadingZero = true;
        }
    }
    return hasIncorrectLeadingZero;
}

function isInvalidCharacter(char) {
    return char !== "0" &&
        char !== "1" &&
        char !== "2" &&
        char !== "3" &&
        char !== "4" &&
        char !== "5" &&
        char !== "6" &&
        char !== "7" &&
        char !== "8" &&
        char !== "9" &&
        char !== "." &&
        char !== "-";
}

function inputIsZero(input) {
    let inputIsZero = true;
    for (let i = 0; i < input.length; i++) {
        if(input.charAt(i) !== "." && input.charAt(i) !== "-" && input.charAt(i) !== "0") {
            inputIsZero = false;
        }
    }
    return inputIsZero;
}

function inputIsInteger(input) {
    return input.indexOf(".") === -1;
}

function writeInteger(input, forceNoAnds = false) {
    let writtenInteger = "";
    if(input.charAt(0) === "-") {
        writtenInteger = "minus ";
        input = input.substr(1);
    }
    if (numberIsTeenHundreds(input)) {
        writtenInteger += handleTeenHundredNumber(input);
    } else {
        writtenInteger += writeBlocksAndTheirNames(input, forceNoAnds);
    }
    return writtenInteger;
}

function writeBlocksAndTheirNames(input, forceNoAnds) {
    let result = "";
    let numberBlocks = getNumberBlocks(input);
    let writtenNumbers = getWrittenBlocks(numberBlocks, forceNoAnds);

    let firstPowerOfMillionAdded = false; // we have to keep track of this to make sure that every number is named properly
    for (let i = 0; i < writtenNumbers.length; i++) {
        let numberBlock = numberBlocks[i];
        let nameForBlock = getNameForBlock(writtenNumbers.length - 1 - i);
        if (parseInt(numberBlock) !== 0) {
            if (firstPowerOfMillionAdded === false && nameForBlock !== "thousand") {
                firstPowerOfMillionAdded = true;
            }
            result += writtenNumbers[i] + " " + nameForBlock + " ";
        } else if (firstPowerOfMillionAdded === false && nameForBlock !== "thousand") {
            result += getNameForBlock(writtenNumbers.length - 1 - i) + " ";
            firstPowerOfMillionAdded = true
        }
    }
    return result.trim();
}

function getWrittenBlocks(numberInBlocks, forceNoAnds) {
    let numberTokens = [];
    numberInBlocks.forEach((numberBlock, index) => {
        numberTokens.push(writeUpToThreeDigitNumber(numberBlock, index === numberInBlocks.length - 1, forceNoAnds));
    });
    return numberTokens;
}

/**
 * Splits an arbitrarily long string into an array of strings where every element has 3 characters, except
 * for the first one, that is 1, 2 or 3 characters long, according to the way we format numbers for readability. For example: "1234567" -> ["1", "234", "567"]
 * @param {string} numberString A string representation of a number (could hold arbitrary data and would still work, but the rule is originally defined for numbers)
 * @return {string[]}           The array of up to 3 character long elements
 * */
export function getNumberBlocks(numberString) {
    let blocks = [];

    let incompleteFirstBlockLength = numberString.length % 3; // if the remainder is 0, the first block is not incomplete
    if(incompleteFirstBlockLength !== 0) {
        blocks.push(numberString.substr(0, incompleteFirstBlockLength));
    }

    for (let i = incompleteFirstBlockLength; i < numberString.length - incompleteFirstBlockLength; i+=3) {
        blocks.push(numberString.substr(i, 3));
    }

    return blocks;
}

/**
 * Generates the written English form of a number that is up to 3 digits long (i.e.: one block of a number)
 * @param {String} upToThreeDigitNumberString The numerical string that represents up to three digits of a number, e.g.: "123"
 * @param {boolean} isLastBlock               Flag parameter that helps the function decide if it needs to put an "and"
 *                                            between the hundreds and the tens/ones(in the last block, it is always
 *                                            required if there's any non-0 number in the tens/ones place,
 *                                            e.g.: "1,002,003" -> "one million two thousand and three": notice there's no "and" before the "two").
 * @param {boolean}  forceNoAnds              Additional flag parameter that can override default "and" insertion logic
 *                                            in cases where "and" is reserved as the marker for the decimal point
 * @return {String}                           The written English form of the number, e.g.: "one hundred and twenty-three"
 * */
export function writeUpToThreeDigitNumber(upToThreeDigitNumberString, isLastBlock, forceNoAnds = false) {
    let {hundredsDigit, tensDigit, onesDigit} = getDigits(upToThreeDigitNumberString);
    let {hundreds, tens, ones} = getHundredsTensAndOnes(hundredsDigit, tensDigit, onesDigit);
    let isTeens = tensDigit === "1";

    let allTokens = [];
    if(hundreds) allTokens.push(hundreds);
    if(shouldPutAndKeyword(hundredsDigit, tensDigit, onesDigit, isLastBlock, forceNoAnds)) allTokens.push("and");

    if(shouldPutDashBetweenTensAndOnes(tensDigit, onesDigit)) { // joined tens and ones
        allTokens.push(tens + "-" + ones);
    } else if(isTeens) { // teens
        allTokens.push(tens);
    } else { // non-joined tens and ones, i.e.: either one is 0 or missing, e.g.: 06 -> six, 50 -> fifty, 8 -> eight
        if(tens) allTokens.push(tens);
        if(ones) allTokens.push(ones);
    }

    return allTokens.join(" ");
}

function numberIsTeenHundreds(input) {
    return input.length === 4 && input[0] === "1" && input[1] !== "0";
}

function handleTeenHundredNumber(input) {
    let tokens = [];
    tokens.push(getTeens(input[0] + input[1]));
    tokens.push("hundred");
    if(shouldPutAndKeyword(input[1], input[2], input[3], true)) tokens.push("and");
    if(!(input[2] === "0" && input[3] === "0")) tokens.push(writeUpToThreeDigitNumber(input[2] + input[3], true));
    return tokens.join(" ");
}

function getDigits(upToThreeDigitNumberString) {
    let reverseOrderNumberDigits = upToThreeDigitNumberString.split("").reverse().join("");
    let hundredsDigit = reverseOrderNumberDigits.length > 2
        ? reverseOrderNumberDigits[2]
        : undefined;
    let tensDigit = reverseOrderNumberDigits.length > 1
        ? reverseOrderNumberDigits[1]
        : undefined;
    let onesDigit = reverseOrderNumberDigits.length > 0
        ? reverseOrderNumberDigits[0]
        : undefined;
    return {hundredsDigit, tensDigit, onesDigit};
}

function getHundredsTensAndOnes(hundredsDigit, tensDigit, onesDigit) {
    let hundreds = hundredsDigit
        ? getHundreds(hundredsDigit)
        : "";
    let tens = tensDigit
        ? tensDigit === "1"
            ? getTeens(tensDigit + (onesDigit || "0"))
            : getTens(tensDigit)
        : "";
    let ones = onesDigit && tensDigit !== "1"
        ? getOnes(onesDigit)
        : "";
    return {hundreds, tens, ones};
}

function shouldPutAndKeyword(hundredsDigit, tensDigit, onesDigit, isLastBlock, forceNoAnds = false) {
    return !forceNoAnds && ((hundredsDigit !== "0" && hundredsDigit !== undefined) || (isLastBlock && hundredsDigit !== undefined)) && (tensDigit !== "0" || onesDigit !== "0");
}

function shouldPutDashBetweenTensAndOnes(tensDigit, onesDigit) {
    return tensDigit !== undefined && tensDigit !== "0" && tensDigit !== "1" && onesDigit !== "0";
}

function getHundreds(numberDigitString) {
    let ones = getOnes(numberDigitString);
    if (ones === "") {
        return "";
    }
    return ones + " hundred";
}

function getOnes(numberDigitString) {
    switch (numberDigitString) {
        case "0":
            return "";
        case "1":
            return "one";
        case "2":
            return "two";
        case "3":
            return "three";
        case "4":
            return "four";
        case "5":
            return "five";
        case "6":
            return "six";
        case "7":
            return "seven";
        case "8":
            return "eight";
        case "9":
            return "nine";
        default:
            throw new Error("Unexpected input: " + numberDigitString);
    }
}

function getTens(numberDigitString) {
    switch (numberDigitString) {
        case "0":
            return "";
        case "1":
            return "ten";
        case "2":
            return "twenty";
        case "3":
            return "thirty";
        case "4":
            return "forty";
        case "5":
            return "fifty";
        case "6":
            return "sixty";
        case "7":
            return "seventy";
        case "8":
            return "eighty";
        case "9":
            return "ninety";
        default:
            throw new Error("Unexpected input: " + numberDigitString);
    }
}

function getTeens(twoNumberString) {
    switch (twoNumberString) {
        case "10":
            return "ten";
        case "11":
            return "eleven";
        case "12":
            return "twelve";
        case "13":
            return "thirteen";
        case "14":
            return "fourteen";
        case "15":
            return "fifteen";
        case "16":
            return "sixteen";
        case "17":
            return "seventeen";
        case "18":
            return "eighteen";
        case "19":
            return "nineteen";
        default:
            throw new Error("Unexpected input: " + twoNumberString);
    }
}

function getNameForBlock(reverseIndexOfBlock) {
    let blockName;

    if (reverseIndexOfBlock % 2 === 1) {
        blockName = "thousand";
    } else {
        blockName = getNameOfLargeNumber(reverseIndexOfBlock / 2);
    }

    return blockName;
}

function getNameOfLargeNumber(powerOfMillion, negativeExponent = false) {
    let powersOfMillion = [
        "",
        "million",
        "billion",
        "trillion",
        "quadrillion",
        "quintillion",
        "sextillion",
        "septillion",
        "octillion",
        "nonillion",
        "decillion",
        "undecillion",
        "duodecillion",
        "tredecillion",
        "quattuordecillion",
        "quindecillion",
        "sexdecillion",
        "septendecillion",
        "octodecillion",
        "novemdecillion",
        "vigintillion"
    ];

    if(powerOfMillion > powersOfMillion.length-1) {
        if(negativeExponent) {
            throw new Error("Fractional part is smaller than what is currently supported. Please enter a number with smaller precision")
        } else {
            throw new Error("Number is larger than what is currently supported. Please enter a smaller number");
        }
    }

    return powersOfMillion[powerOfMillion];
}

function writeFractional(fractionalPart) {
    let writtenNumber = writeInteger(trimLeadingZeroes(fractionalPart), true);
    let nameOfNumber = getNameOfFractionalNumber(fractionalPart.length, isFractionalPlural(fractionalPart));
    return writtenNumber
        ? writtenNumber + " " + nameOfNumber
        : "";
}

function trimLeadingZeroes(fractionalPart) {
    let trimmed = fractionalPart;
    for (let i = 0; i < fractionalPart.length; i++) {
        if(!(fractionalPart.charAt(i) === "0")) {
            trimmed = fractionalPart.substr(i, fractionalPart.length - i);
            break;
        }
    }
    return trimmed;
}

function getNameOfFractionalNumber(lengthOfFractionalPart, isPlural) {
    let lowerThanMillionPart = getLowerThanMillionPart(lengthOfFractionalPart % 6);
    let higherThanMillionPart = getNameOfLargeNumber(Math.floor(lengthOfFractionalPart / 6), true);

    let tokens = [];
    if(lowerThanMillionPart) tokens.push(lowerThanMillionPart);
    if(higherThanMillionPart) tokens.push(higherThanMillionPart);

    return tokens.join(" ") + "th" + (isPlural ? "s" : "");
}

function getLowerThanMillionPart(length) {
    switch (length) {
        case 0:
            return "";
        case 1:
            return "ten";
        case 2:
            return "hundred";
        case 3:
            return "thousand";
        case 4:
            return "ten thousand";
        case 5:
            return "hundred thousand";
        default:
            throw new Error("Unexpected input: " + length);
    }
}

function isFractionalPlural(fractionalPart) {
    for (let i = 0; i < fractionalPart.length; i++) {
        if(!(fractionalPart.charAt(i) === "0" || fractionalPart.charAt(i) === "1" && i === fractionalPart.length - 1)) {
            return true;
        }
    }
    return false;
}

function joinIntegerAndFractionalParts(writtenInteger, writtenFractional) {
    let result = "";
    if(writtenInteger) {
        result += writtenInteger
    }
    if(writtenInteger && writtenInteger !== "minus " && writtenFractional) {
        result += " and ";
    }
    if(writtenFractional) {
        result += writtenFractional;
    }

    return result;
}

