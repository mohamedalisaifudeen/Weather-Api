const Path = require("path");
const CustomLog = require("./helpers/CustomLog");
const { valueStringCheck } = require("./valueChecker");
const StringOperations = require("./stringOperations");

const LOGGER = new CustomLog(Path.basename(__filename));

const splitKeyValuesAndCreateObject = (keyValueString) => {
  try {
    const splitKeyValueArray = StringOperations.keyValuePairSplitter(
      keyValueString
    );

    const splitKeyValueArrayLength = splitKeyValueArray.length;
    const returnObject = {};

    for (
      let keyValuePairCounter = 0;
      keyValuePairCounter < splitKeyValueArrayLength;
      keyValuePairCounter += 1
    ) {
      const keyValuePair = splitKeyValueArray[keyValuePairCounter].trim();
      const keyValueSplit = StringOperations.keyValueSplitter(keyValuePair);

      const formattedKeyString = valueStringCheck(keyValueSplit[0].trim());
      returnObject[formattedKeyString] = valueStringCheck(
        keyValueSplit[1].trim()
      );
    }

    return returnObject;
  } catch (error) {
    LOGGER.error(error);
    throw new Error(error);
  }
};

const convertObject = (jsonString) => {
  try {
    jsonString = StringOperations.prepareJsonString(jsonString);
    const jsonObject = splitKeyValuesAndCreateObject(jsonString);

    return jsonObject;
  } catch (error) {
    LOGGER.error(error);
  }
};

exports.convertObject = convertObject;
