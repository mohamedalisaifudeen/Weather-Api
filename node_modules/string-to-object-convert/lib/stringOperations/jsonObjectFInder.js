const Path = require("path");
const CustomLog = require("../helpers/CustomLog");

const LOGGER = new CustomLog(Path.basename(__filename));

/*
 * Return array of index values in string that contain specified character
 */
const charOccurrencesFinder = (valueString, findingChar) => {
  try {
    const occurrenceArray = [];

    let startIndex = 0;
    while (valueString.indexOf(findingChar, startIndex) !== -1) {
      const occurrenceIndex = valueString.indexOf(findingChar, startIndex);
      occurrenceArray.push(occurrenceIndex);

      startIndex = occurrenceIndex + 1;
    }

    return occurrenceArray;
  } catch (error) {
    LOGGER.error(error);
    throw new Error(error);
  }
};

const getClosingBracketIndexOfMainObject = (separatedString) => {
  try {
    const allOpenIndexes = charOccurrencesFinder(separatedString, "{");
    const allCloseIndexes = charOccurrencesFinder(separatedString, "}");

    let closeIndexHasNoOpen = 0;
    let closeIndexCounter = 0;
    while (true) {
      closeIndexHasNoOpen = allCloseIndexes[closeIndexCounter];

      const lowestOpenOccurrence = allOpenIndexes.findIndex(
        (element) => element < closeIndexHasNoOpen
      );
      if (lowestOpenOccurrence === -1) {
        break;
      }

      allOpenIndexes.splice(lowestOpenOccurrence, 1);
      closeIndexCounter += 1;
    }

    return closeIndexHasNoOpen;
  } catch (error) {
    LOGGER.error(error);
    throw new Error(error);
  }
};

const findObjects = (
  keyValuePair,
  preparedValue,
  fullString,
  splitCharIndex
) => {
  try {
    // If object not found inside key value pairs. Return key value pair
    if (preparedValue[0] !== "{") {
      return {
        keyValuePair,
        splitCharIndex,
        objectFound: false,
      };
    }

    /*
     * There is an object in value.
     *  Continue to check what is the main object start and end indexes
     */
    const firstOpenIndex = keyValuePair.indexOf("{");
    const lastCloseIndex = fullString.lastIndexOf("}");
    const separatedString = fullString.substring(
      firstOpenIndex + 1,
      lastCloseIndex
    );

    const separatedStringFirstOpenIndex = separatedString.indexOf("{");
    /*
     * If there is only one object found as the value. Return the key and value object
     * Example string - testField: { value: "hi Guys" }
     */
    if (separatedStringFirstOpenIndex === -1) {
      return {
        keyValuePair: fullString.substring(0, lastCloseIndex + 1),
        splitCharIndex: lastCloseIndex,
        objectFound: true,
      };
    }

    const separatedStringFirstCloseIndex = separatedString.indexOf("}");
    /*
     * If there are separate objects found. Return key and first value object
     * Example string - firstTestField: { value: "hi Guys" }, secondTestField: { value: "How are you" }
     */
    if (separatedStringFirstCloseIndex < separatedStringFirstOpenIndex) {
      return {
        keyValuePair: fullString.substring(
          0,
          firstOpenIndex + separatedStringFirstCloseIndex + 2
        ),
        splitCharIndex: firstOpenIndex + separatedStringFirstCloseIndex + 2,
        objectFound: true,
      };
    }

    /*
     * There are object inside object. Finding the index of the closing bracket index of main object
     * Example string - firstTestField: { value: "hi Guys", insideField: { secondValue: "Where are you" } }, secondTestField: { value: "How are you" }
     */
    const mainClosingIndex = getClosingBracketIndexOfMainObject(
      separatedString
    );

    return {
      keyValuePair: fullString.substring(
        0,
        firstOpenIndex + mainClosingIndex + 2
      ),
      splitCharIndex: firstOpenIndex + mainClosingIndex + 2,
      objectFound: true,
    };
  } catch (error) {
    LOGGER.error(error);
    throw new Error(error);
  }
};

exports.findObjects = findObjects;
exports.charOccurrencesFinder = charOccurrencesFinder;
