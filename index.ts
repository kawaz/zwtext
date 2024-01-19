/**
 * Encode data to ZWT (zero-width-text)
 * @param {string | Uint8Array} data
 * @returns {string}
 */
const encodeZW = (data: string | Uint8Array): string => {
	if (typeof data === "string") {
		return encodeZW(new TextEncoder().encode(data));
	}
	return `\u200c${[...data]
		.map((n) =>
			n
				.toString(2)
				.padStart(8, "0")
				.replace(/0/g, "\u200b")
				.replace(/1/g, "\u200d"),
		)
		.join("")}\u200c`;
};

/**
 * Decode ZWTs (zero-width-texts) in text into Uint8Array[]
 * @param {string} text string containing ZWTs (zero-width-text)
 * @returns {Uint8Array[]}
 */
const decodeZWsToUint8Array = (text: string) =>
	Array.from(text.matchAll(/\u200c([\u200b\u200d]+)\u200c/g))
		.map((re) => re[1].replace(/\u200b/g, "0").replace(/\u200d/g, "1"))
		.map(
			(zo) =>
				new Uint8Array((zo.match(/.{8}/g) || []).map((b) => parseInt(b, 2))),
		);


/**
 * Decode ZWTs (zero-width-texts) in text into string[]
 * @param {string} text string containing ZWTs (zero-width-text)
 * @returns {string[]}
 */
const decodeZWs = (text: string) =>
	decodeZWsToUint8Array(text).map((a) => new TextDecoder().decode(a));

/**
 * Decode ZWT (zero-width-text) in text into string[]
 * @param {string} text string containing ZWTs (zero-width-texts)
 * @param {number} i index of ZWTs (zero-width-texts)
 * @returns {string}
 */
const decodeZW = (text: string, i = 0) => decodeZWs(text)[i] ?? "";

/**
 * Strip ZWTs (zero-width-texts) from text
 * @param {string} text
 * @returns {string}
 */
const stripZW = (text: string) => text.replace(/\u200c(?:[\u200b\u200d]{8})+\u200c/g, "");

/**
 * Reveal ZWTs (zero-width-texts) in text
 * @param {string} text string containing ZWTs (zero-width-texts)
 * @returns {string}
 */
const revealZW = (text: string) =>
	text.replace(/\u200c(?:[\u200b\u200d]{8})+\u200c/g, (z) => decodeZW(z));


export default {
    encodeZW,
    decodeZW,
    decodeZWs,
    decodeZWsToUint8Array,
    revealZW,
    stripZW
}
