import {getWrittenNumber} from "../src/writeNumber.js";
import {getNumberInBlocks, writeUpToThreeDigitNumber} from "../src/writeNumber";


/*********************************************************************************/
//                         TESTS FOR INCORRECT INPUT                             //
/*********************************************************************************/
test("Incorrect input: not a number", () => {
    expect(getWrittenNumber("abc")).toBe("Your input was not a simple number. Please write one into the input field if you want a correct result.");
});

test("Incorrect input: exponential form", () => {
    expect(getWrittenNumber("1e2")).toBe("Your input was not a simple number. Please write one into the input field if you want a correct result.");
});

test("Incorrect input: undefined", () => {
    expect(getWrittenNumber(undefined)).toBe("Your input was not a simple number. Please write one into the input field if you want a correct result.");
});

test("Incorrect input: null", () => {
    expect(getWrittenNumber(null)).toBe("Your input was not a simple number. Please write one into the input field if you want a correct result.");
});



/*********************************************************************************/
//                    TESTS FOR NUMBER BLOCK PARTITIONING                        //
/*********************************************************************************/
test("Number block partitioning test: only one 3 member block", () => {
    expect(getNumberInBlocks("100")).toStrictEqual(["100"]);
});

test("Number block partitioning test: only 3 member blocks", () => {
    expect(getNumberInBlocks("100000")).toStrictEqual(["100", "000"]);
});

test("Number block partitioning test: first block has 2 members", () => {
    expect(getNumberInBlocks("10000")).toStrictEqual(["10", "000"]);
});

test("Number block partitioning test: first block has only one member", () => {
    expect(getNumberInBlocks("1000")).toStrictEqual(["1", "000"]);
});


/*********************************************************************************/
//                    TESTS FOR 3 DIGITS WRITING                                 //
/*********************************************************************************/
test("Test for 3 digits writing: simple case", () => {
    expect(writeUpToThreeDigitNumber("123")).toBe("one hundred and twenty-three");
});

test("Test for 3 digits writing: teens case", () => {
    expect(writeUpToThreeDigitNumber("113")).toBe("one hundred and thirteen");
});

test("Test for 3 digits writing: ten case", () => {
    expect(writeUpToThreeDigitNumber("210")).toBe("two hundred and ten");
});

test("Test for 3 digits writing: no ones case", () => {
    expect(writeUpToThreeDigitNumber("180")).toBe("one hundred and eighty");
});

test("Test for 3 digits writing: no tens case", () => {
    expect(writeUpToThreeDigitNumber("605")).toBe("six hundred and five");
});

test("Test for 3 digits writing: no tens and ones case", () => {
    expect(writeUpToThreeDigitNumber("400")).toBe("four hundred");
});

test("Test for 3 digits writing: 2 members with no ones", () => {
    expect(writeUpToThreeDigitNumber("60")).toBe("sixty");
});

test("Test for 3 digits writing: only one member", () => {
    expect(writeUpToThreeDigitNumber("5")).toBe("five");
});

test("Test for 3 digits writing: 3 members with no hundreds", () => {
    expect(writeUpToThreeDigitNumber("066")).toBe("sixty-six");
});

test("Test for 3 digits writing: 3 members with no hundreds and tens", () => {
    expect(writeUpToThreeDigitNumber("007")).toBe("seven");
});

test("Test for 3 digits writing: 3 members with no hundreds or ones", () => {
    expect(writeUpToThreeDigitNumber("090")).toBe("ninety");
});



/*********************************************************************************/
//                    TESTS FOR COMPLETE WRITING                                 //
/*********************************************************************************/
test("Complete number: two simple blocks", () => {
    expect(getWrittenNumber("123456")).toBe("one hundred and twenty-three thousand four hundred and fifty-six");
});

test("Complete number: last \"and\" test", () => {
    expect(getWrittenNumber("1002")).toBe("one thousand and two");
});

test("Complete number: last \"and\" test with no middle \"and\"", () => {
    expect(getWrittenNumber("1002003")).toBe("one million two thousand and three");
});

test("Complete number: last \"and\" test with middle \"and\"s", () => {
    expect(getWrittenNumber("1203405")).toBe("one million two hundred and three thousand four hundred and five");
});



/*********************************************************************************/
//                    TESTS FOR TEEN HUNDRED WRITING                             //
/*********************************************************************************/
test("Complete number: teen hundreds simple", () => {
    expect(getWrittenNumber("1355")).toBe("thirteen hundred and fifty-five");
});

test("Complete number: teen hundreds with no tens and ones", () => {
    expect(getWrittenNumber("1300")).toBe("thirteen hundred");
});

test("Complete number: teen hundreds with no ones", () => {
    expect(getWrittenNumber("1320")).toBe("thirteen hundred and twenty");
});

test("Complete number: teen hundreds with no tens", () => {
    expect(getWrittenNumber("1302")).toBe("thirteen hundred and two");
});

test("Complete number: teen hundreds with teens", () => {
    expect(getWrittenNumber("1117")).toBe("eleven hundred and seventeen");
});



/*********************************************************************************/
//                    TESTS FOR NON-INTEGER WRITING                              //
/*********************************************************************************/
test("Non-integer number: simple case with tenths", () => {
    expect(getWrittenNumber("1.2")).toBe("one and two tenths");
});

test("Non-integer number: simple case with hundredths", () => {
    expect(getWrittenNumber("1.03")).toBe("one and three hundredths");
});

test("Non-integer number: simple case with thousandths", () => {
    expect(getWrittenNumber("1.004")).toBe("one and four thousandths");
});

test("Non-integer number: simple case with ten thousandths", () => {
    expect(getWrittenNumber("1.0005")).toBe("one and five ten thousandths");
});

test("Non-integer number: simple case with hundred thousandths", () => {
    expect(getWrittenNumber("1.00006")).toBe("one and six hundred thousandths");
});

test("Non-integer number: simple case with millionth", () => {
    expect(getWrittenNumber("1.000007")).toBe("one and seven millionths");
});

test("Non-integer number: simple case with ten millionth", () => {
    expect(getWrittenNumber("1.0000008")).toBe("one and eight ten millionths");
});

test("Non-integer number: simple case with hundred millionth", () => {
    expect(getWrittenNumber("1.00000009")).toBe("one and nine hundred millionths");
});

test("Non-integer number: simple case with thousand millionth", () => {
    expect(getWrittenNumber("1.000000010")).toBe("one and ten thousand millionths");
});

test("Non-integer number: simple case with ten thousand millionth", () => {
    expect(getWrittenNumber("1.0000000011")).toBe("one and eleven ten thousand millionths");
});

test("Non-integer number: simple case with hundred thousand millionth", () => {
    expect(getWrittenNumber("1.00000000012")).toBe("one and twelve hundred thousand millionths");
});

test("Non-integer number: no integer part", () => {
    expect(getWrittenNumber("0.2")).toBe("two tenths");
});

test("Non-integer number: singular fractional part", () => {
    expect(getWrittenNumber("1.1")).toBe("one and one tenth");
});

test("Non-integer number: complex number", () => {
    expect(getWrittenNumber("123456789123456789.123456789123456789")).toBe("one hundred twenty-three thousand four hundred fifty-six billion " +
                                                                                  "seven hundred eighty-nine thousand one hundred twenty-three million " +
                                                                                  "four hundred fifty-six thousand seven hundred eighty-nine and " +
                                                                                  "one hundred twenty-three thousand four hundred fifty-six billion " +
                                                                                  "seven hundred eighty-nine thousand one hundred twenty-three million " +
                                                                                  "four hundred fifty-six thousand seven hundred eighty-nine trillionths");
});

test("Non-integer number: zero fractional", () => {
    expect(getWrittenNumber("1.0")).toBe("one");
});

test("Non-integer number: zero fractional, large integer", () => {
    expect(getWrittenNumber("123456789.0")).toBe("one hundred and twenty-three million four hundred and fifty-six thousand seven hundred and eighty-nine");
});


/*********************************************************************************/
//                    TESTS FOR NEGATIVE NUMBER WRITING                          //
/*********************************************************************************/
test("Negative number: simple case", () => {
    expect(getWrittenNumber("-1")).toBe("minus one");
});

test("Negative number: big integer", () => {
    expect(getWrittenNumber("-1234567")).toBe("minus one million two hundred and thirty-four thousand five hundred and sixty-seven");
});

test("Negative number: integer and fractional", () => {
    expect(getWrittenNumber("-1.1")).toBe("minus one and one tenth");
});

test("Negative number: fractional only", () => {
    expect(getWrittenNumber("-0.002")).toBe("minus two thousandths");
});


/*********************************************************************************/
//                          TESTS FOR EDGE CASES                                 //
/*********************************************************************************/
test("Edge case: number is too big", () => {
    expect(getWrittenNumber("1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000")).toBe("Number is larger than what is currently supported. Please enter a smaller number");
});
