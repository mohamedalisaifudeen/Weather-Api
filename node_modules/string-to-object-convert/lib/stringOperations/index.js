const Path = require("path");
const CustomLog = require("../helpers/CustomLog");
const ObjectFinder = require("./jsonObjectFinder");
const ArrayValueFinder = require("./arrayValueFinder");

const LOGGER = new CustomLog(Path.basename(__filename));

const resetCharacter = (resetIndex, valueString) => {
  try {
    return (
      valueString.substring(0, resetIndex) +
      "" +
      valueString.substring(resetIndex + 1)
    );
  } catch (error) {
    LOGGER.error(error);
    throw new Error(error);
  }
};

const prepareJsonString = (jsonString) => {
  try {
    jsonString = resetCharacter(jsonString.indexOf("{"), jsonString);
    jsonString = resetCharacter(jsonString.lastIndexOf("}"), jsonString);

    return jsonString.trim();
  } catch (error) {
    LOGGER.error(error);
    throw new Error(error);
  }
};

const prepareArrayString = (arrayString) => {
  try {
    arrayString = resetCharacter(arrayString.indexOf("["), arrayString);
    arrayString = resetCharacter(arrayString.lastIndexOf("]"), arrayString);

    return arrayString.trim();
  } catch (error) {
    LOGGER.error(error);
    throw new Error(error);
  }
};

const keyValueSplitter = (keyValuePair) => {
  try {
    const splitCharIndex = keyValuePair.indexOf(":");
    return [
      keyValuePair.substring(0, splitCharIndex),
      keyValuePair.substring(splitCharIndex + 1),
    ];
  } catch (error) {
    LOGGER.error(error);
    throw new Error(error);
  }
};

const prepareValueOnly = (keyValuePair) => {
  try {
    const separatedValue = keyValueSplitter(keyValuePair);
    return separatedValue[1].trim();
  } catch (error) {
    LOGGER.error(error);
    throw new Error(error);
  }
};

// Assume there are no commas inside string values
const keyValuePairSplitter = (allKeyValuePairsString) => {
  try {
    const keyValuePairArray = [];

    while (allKeyValuePairsString.indexOf(",") !== -1) {
      const splitCharIndex = allKeyValuePairsString.indexOf(",");

      const keyValuePair = allKeyValuePairsString.substring(0, splitCharIndex);
      const preparedValue = prepareValueOnly(keyValuePair);

      let returnValue = ObjectFinder.findObjects(
        keyValuePair,
        preparedValue,
        allKeyValuePairsString,
        splitCharIndex
      );
      if (!returnValue.objectFound) {
        returnValue = ArrayValueFinder.findArray(
          keyValuePair,
          preparedValue,
          allKeyValuePairsString,
          splitCharIndex
        );
      }
      keyValuePairArray.push(returnValue.keyValuePair);

      allKeyValuePairsString = allKeyValuePairsString
        .substring(returnValue.splitCharIndex + 1)
        .trim();
      if (allKeyValuePairsString[0] === ",") {
        allKeyValuePairsString = allKeyValuePairsString.slice(1).trim();
      }
    }

    if (allKeyValuePairsString !== "") {
      keyValuePairArray.push(allKeyValuePairsString);
    }

    return keyValuePairArray;
  } catch (error) {
    LOGGER.error(error);
    throw new Error(error);
  }
};

const buildArray = (arrayString) => {
  try {
    if (arrayString[0] === '"') {
      return ArrayValueFinder.stringValueSplitter(arrayString);
    }

    if (arrayString[0] === "{") {
      return ArrayValueFinder.objectValueSplitter(arrayString);
    }
  } catch (error) {
    LOGGER.error(error);
    throw new Error(error);
  }
};

exports.prepareJsonString = prepareJsonString;
exports.keyValuePairSplitter = keyValuePairSplitter;
exports.keyValueSplitter = keyValueSplitter;
exports.prepareArrayString = prepareArrayString;
exports.buildArray = buildArray;
