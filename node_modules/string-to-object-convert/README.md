# String to Object converter

Convert a string that contains an object.

```js

For example

This will convert string like this to '{ appName: "JsonTest", keywords: { $in: [ "json", "string" ] } }'
Object like below
{
    appName: 'JsonTest',
    keywords: {
        $in: [ 'json', 'string' ]
    }
}

```

---

## Assumptions

- Strings inside the object do not contain commas. For example, this string values is not valid: "Hi, How are you"

## Installation

    $ npm install string-to-object-convert

## Quick Start

```js
import StringToObject from "string-to-object-convert";

const jsonString =
  '{ appName: "JsonTest", keywords: { $in: [ "json", "string" ] } }';
// IMPORTANT - String should provide within single quotes. String inside the object should provide within double quotes.

const resultObject = StringToObject.convertObject(jsonString);
```

## License

MIT
