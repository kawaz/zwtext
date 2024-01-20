# zwtext | ZWT (Zero Width Text) encoder and decorder

ZWT (zero width text) is an invisible string encoding that allows embedding any data into text without visually affecting it, by utilizing zero-width characters in UNICODE.

## Specification

- ZWT (zero-width-text) consists of the following three types of zero-width characters:
  - `U+200B` ZWSP (zero width space)
  - `U+200C` ZWJ (zero width joiner)
  - `U+200D` ZWNJ (zero width non-joiner)
- Zero width text is intended to be embedded mainly at the boundaries of documents or words, so it is surrounded by `ZWNJ` to prevent unintended joining of adjacent characters with `ZWJ`.
- The structure of the zero width text string is `ZWNJ 1* ( 8 ( ZWSP / ZWJ ) ) ZWNJ`
- Zero width text data size will be 8 times the original + 2 bytes.
- The data part of the zero width text is a simple replacement of the bits 0/1 of the original data with the two characters `ZWSP` and `ZWJ`.
- Multiple zero width text strings can be embedded in a single string, so the decode function returns an array of multiple data (for simplicity, a function that returns only one string is also provided).
- Zero width text can be detected with a simple pattern, so a function is also provided to strip them.

## Usage

```js
import {
    encodeZW,
    decodeZW,
    decodeZWs,
    decodeZWsToUint8Array,
    revealZW,
    stripZW
} from 'zwtext'

secret1 = encodeZW(' secret world');
secret2 = encodeZW(' こんにちわ✋');
text = `Hello${secret1}!${secret2}`;
decodeZWs(text);
decodeZW(text);
revealZW(text);
striped = stripZW(text);
decodeZWs(striped);
```
