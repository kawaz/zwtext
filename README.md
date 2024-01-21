# zwtext | ZWT (Zero Width Text) encoder and decorder

ZWT (zero width text) is an invisible string encoding that allows embedding any data into text without visually affecting it, by utilizing zero-width characters in UNICODE.

## Specification

- ZWT (zero-width-text) consists of the following three types of zero-width characters:
  - `U+200B` ZWSP (zero width space)
  - `U+200C` ZWJ (zero width joiner)
  - `U+200D` ZWNJ (zero width non-joiner)
- The structure of the zero width text string is `ZWNJ 1* ( 8 ( ZWSP / ZWJ ) ) ZWNJ`
  - Zero width text is intended to be embedded mainly at the boundaries of documents or words, so it is surrounded by `ZWNJ` to prevent unintended joining of adjacent characters with `ZWJ`.
  - The data part of the zero width text is a simple replacement of the bits 0/1 of the original data with the two characters `ZWSP` and `ZWJ`.
- The size of zero-width text will be 24 times the original size plus 6 bytes (very large)
- Zero-width text is a simple pattern string
  - Multiple zero-width text strings can be embedded within a single string
  - Easy to strip and reveal

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

secret1 = encodeZW(' secret world'); // looks like '', 106 characters, 318 bytes
secret2 = encodeZW(' こんにちわ✋'); // looks like '', 154 characters, 462 bytes
text = `Hello${secret1}!${secret2}?`; // looks like 'Hello!?', 267 characters, 787 bytes
decodeZW(text); // ' secret world'
revealZW(text); // 'Hello secret world! こんにちわ✋?'
striped = stripZW(text); // 'Hello!?'
decodeZWs(striped); // '' (length is 7)
```
