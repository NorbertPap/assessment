/**
 * Converts any positive integer into it's written form in English
 * @param {string} input Accepts any type of input string, and decides if it's suitable for the task, i.e.: the input is a string representation of a number.
 * @return {string}      The message that should be displayed on the web page: if there's something wrong with the input, it returns an error message,
 *                       for actual numerical strings, it returns the written English form of the number.
 */
export function getWrittenNumber(input) {
    let stringToDisplay;

    if(isIncorrectNumberInput(input)) {
        stringToDisplay = "Your input was not a simple number. Please write one into the input field if you want a correct result.";
    } else {
        try {
            if(inputIsInteger(input)) {
                stringToDisplay = writeInteger(input);
            } else {
                let [integerPart, fractionalPart] = input.split(".");
                stringToDisplay = joinIntegerAndFractionalParts(writeInteger(integerPart, true), writeFractional(fractionalPart));
            }
        } catch (e) {
            stringToDisplay = e.message;
        }
    }

    return stringToDisplay;
}

function isIncorrectNumberInput(input) {
    let incorrectNumberInput = false;
    // Undefined and null check
    if(input === undefined || input === null) return true;
    // Input was not a number
    incorrectNumberInput |= Number.isNaN(Number.parseFloat(input));
    // Input has comma
    incorrectNumberInput |= input.indexOf(",") !== -1;
    // Input was in exponential form, e.g.: 1.2345E4
    incorrectNumberInput |= input.indexOf("e") !== -1;
    incorrectNumberInput |= input.indexOf("E") !== -1;
    // Input is negative
    incorrectNumberInput |= input.indexOf("-") !== -1;

    return incorrectNumberInput;
}

function inputIsInteger(input) {
    return input.indexOf(".") === -1;
}

function writeInteger(input, forceNoAnds = false) {
    let writtenInteger;
    if (numberIsTeenHundreds(input)) {
        writtenInteger = handleTeenHundredNumber(input);
    } else {
        let result = "";
        let numberInBlocks = getNumberInBlocks(input);

        let numberTokens = [];
        numberInBlocks.forEach((numberBlock, index) => {
            numberTokens.push(writeUpToThreeDigitNumber(numberBlock, index === numberInBlocks.length - 1, forceNoAnds));
        });

        for (let i = 0; i < numberTokens.length; i++) {
            result += numberTokens[i] + " " + getNameForBlock(numberTokens.length - 1 - i) + " ";
        }

        writtenInteger = result.trim();
    }
    return writtenInteger;
}

/**
 * Splits an arbitrarily long string into an array of strings where every element has 3 characters, except
 * for the first one, that is 1, 2 or 3 characters long, according to the way we format numbers for readability. For example: "1234567" -> ["1", "234", "567"]
 * @param {string} numberString A string representation of a number (could hold arbitrary data and would still work, but the rule is originally defined for numbers)
 * @return {string[]}           The array of up to 3 character long elements
 * */
export function getNumberInBlocks(numberString) {
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

function getNameOfLargeNumber(powerOfMillion) {
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
        throw new Error("Number is larger than what is currently supported. Please enter a smaller number");
    }

    return powersOfMillion[powerOfMillion];
}

function writeFractional(fractionalPart) {
    let writtenNumber = writeInteger(trimLeadingZeroes(fractionalPart), true);
    let nameOfNumber = getNameOfFractionalNumber(fractionalPart.length, isFractionalPlural(fractionalPart));
    return writtenNumber + " " + nameOfNumber;
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
    let higherThanMillionPart = getNameOfLargeNumber(Math.floor(lengthOfFractionalPart / 6));

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
    return writtenInteger
        ? writtenInteger + " and " + writtenFractional
        : writtenFractional;
}

