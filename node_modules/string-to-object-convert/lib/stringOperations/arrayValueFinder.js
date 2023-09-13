const Path = require("path");
const CustomLog = require("../helpers/CustomLog");
const JsonObjectFinder = require("./jsonObjectFinder");
const JsonConverter = require("../index");

const LOGGER = new CustomLog(Path.basename(__filename));

const stringValueSplitter = (arrayString) => {
  try {
    const stringOpenCloseIndexes = JsonObjectFinder.charOccurrencesFinder(
      arrayString,
      '"'
    );

    const stringArray = [];
    for (
      let stringIndexCounter = 0;
      stringIndexCounter < stringOpenCloseIndexes.length;
      stringIndexCounter += 2
    ) {
      const stringValue = arrayString.substring(
        stringOpenCloseIndexes[stringIndexCounter] + 1,
        stringOpenCloseIndexes[stringIndexCounter + 1]
      );
      stringArray.push(stringValue);
    }

    return stringArray;
  } catch (error) {
    LOGGER.error(error);
    throw new Error(error);
  }
};

const objectValueSplitter = (arrayString) => {
  try {
    const objectArray = [];

    while (arrayString.indexOf(",") !== -1) {
      const splitCharIndex = arrayString.indexOf(",");

      const keyValuePair = arrayString.substring(0, splitCharIndex);

      const returnValue = JsonObjectFinder.findObjects(
        keyValuePair,
        keyValuePair,
        arrayString,
        splitCharIndex
      );
      const createdObject = JsonConverter.convertJson(returnValue.keyValuePair);
      objectArray.push(createdObject);

      arrayString = arrayString
        .substring(returnValue.splitCharIndex + 1)
        .trim();
    }

    if (arrayString !== "") {
      const createdObject = JsonConverter.convertJson(arrayString);
      objectArray.push(createdObject);
    }

    return objectArray;
  } catch (error) {
    LOGGER.error(error);
    throw new Error(error);
  }
};

const findArray = (keyValuePair, preparedValue, fullString, splitCharIndex) => {
  try {
    // If array not found inside key value pairs. Return key value pair
    if (preparedValue[0] !== "[") {
      return {
        keyValuePair,
        splitCharIndex,
      };
    }

    /*
     * There is an array in value.
     * Continue to check what is the main array start and end indexes
     */
    const firstOpenIndex = keyValuePair.indexOf("[");
    const lastCloseIndex = fullString.lastIndexOf("]");
    const separatedString = fullString.substring(
      firstOpenIndex + 1,
      lastCloseIndex
    );

    const separatedStringFirstOpenIndex = separatedString.indexOf("[");
    /*
     * If there is only one array found as the value. Return the key and value array
     * Example string - testField: [ value1, value2 ]
     */
    if (separatedStringFirstOpenIndex === -1) {
      return {
        keyValuePair: fullString.substring(0, lastCloseIndex + 1),
        splitCharIndex: lastCloseIndex,
      };
    }

    const separatedStringFirstCloseIndex = separatedString.indexOf("]");
    /*
     * If there are separate array found. Return key and first value array
     * Example string - firstTestField: [ value1, value2 ], secondTestField: [ value3, value4 ]
     */
    if (separatedStringFirstCloseIndex < separatedStringFirstOpenIndex) {
      return {
        keyValuePair: fullString.substring(
          0,
          firstOpenIndex + separatedStringFirstCloseIndex + 2
        ),
        splitCharIndex: firstOpenIndex + separatedStringFirstCloseIndex + 2,
      };
    }
  } catch (error) {
    LOGGER.error(error);
    throw new Error(error);
  }
};

exports.stringValueSplitter = stringValueSplitter;
exports.objectValueSplitter = objectValueSplitter;
exports.findArray = findArray;
