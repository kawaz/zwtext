import { describe, expect, it } from "bun:test";
import { decodeZW, decodeZWs, decodeZWsToUint8Array, encodeZW, revealZW, stripZW } from "../src";

describe("ZWT Encoding and Decoding", () => {
  describe("encodeZW", () => {
    it("should increase the byte size by 24 times plus 6 bytes", () => {
      const testData = ["Hello", "あいうえお", "👨‍👩‍👦‍👦"];
      testData.forEach((originalString) => {
        const originalByteSize = new TextEncoder().encode(originalString).length;
        const expectedByteSize = originalByteSize * 24 + 6;
        const encodedString = encodeZW(originalString);
        const encodedByteSize = new TextEncoder().encode(encodedString).length;
        expect(encodedByteSize).toBe(expectedByteSize);
      });
    });

    it("should increase the size of Uint8Array data by 24 times plus 6 bytes", () => {
      const originalArray = new Uint8Array([72, 101, 108, 108, 111]);
      const originalByteSize = originalArray.length;
      const expectedByteSize = originalByteSize * 24 + 6;
      const encodedString = encodeZW(originalArray);
      const encodedByteSize = new TextEncoder().encode(encodedString).length;
      expect(encodedByteSize).toBe(expectedByteSize);
    });

    it("should encode and decode a string correctly", () => {
      const testData = ["Hello", "あいうえお", "👨‍👩‍👦‍👦", new Uint8Array([2, 22, 222])];
      testData.forEach((data) => {
        const encoded = encodeZW(data);
        expect(encoded).toMatch(/\u200c(?:[\u200b\u200d]{8})+\u200c/);
      });
    });

    it("should return an empty string when encoding an empty string", () => {
      const encodedString = encodeZW("");
      expect(encodedString).toBe("");
    });
  });

  describe("decodeZWsToUint8Array", () => {
    it("should encode and decode a Uint8Array correctly", () => {
      const original = new Uint8Array([72, 101, 108, 108, 111]);
      const encoded = encodeZW(original);
      const decodedArray = decodeZWsToUint8Array(encoded);
      expect(decodedArray[0]).toEqual(original);
    });
  });

  describe("decodeZWs", () => {
    it("should decode multiple ZWTs correctly", () => {
      const texts = ["Hello", "World"];
      const encoded = texts.map((t) => encodeZW(t)).join(" ");
      const decoded = decodeZWs(encoded);
      expect(decoded).toEqual(texts);
    });
  });

  describe("decodeZW", () => {
    it("should decode the first ZWT by default", () => {
      const texts = ["First", "Second"];
      const encoded = texts.map((t) => encodeZW(t)).join(" ");
      const decodedFirst = decodeZW(encoded);
      expect(decodedFirst).toBe(texts[0]);
    });

    it("should decode specific ZWT correctly by index", () => {
      const texts = ["First", "Second"];
      const encoded = texts.map((t) => encodeZW(t)).join(" ");
      const decodedFirst = decodeZW(encoded, 0);
      const decodedSecond = decodeZW(encoded, 1);
      expect(decodedFirst).toBe(texts[0]);
      expect(decodedSecond).toBe(texts[1]);
    });
  });

  describe("stripZW", () => {
    it("should strip ZWTs from text correctly", () => {
      const original = "Text with hidden message";
      const encoded = encodeZW("hidden") + original + encodeZW("㊙");
      const stripped = stripZW(encoded);
      expect(stripped).toBe(original);
    });
  });

  describe("revealZW", () => {
    it("should reveal ZWTs in text correctly", () => {
      const hidden = "見えない";
      const shown = "見える";
      const encoded = shown + encodeZW(hidden) + shown + encodeZW(hidden);
      const revealed = revealZW(encoded);
      expect(revealed).toBe(shown + hidden + shown + hidden);
    });
  });
});
