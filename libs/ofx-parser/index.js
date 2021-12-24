const { XMLParser } = require('fast-xml-parser');

const HEADER_END_REGEX = /\r\n\r\n/gm;
const NODE_REGEX = /<([\w]+)>/gm;
const ATTRIBUTE_REGEX = /<([\w]+)>(.+)/;

const parser = new XMLParser();

const getHeader = (ofxData) => {
	const headerString = ofxData.split(HEADER_END_REGEX)[0];
	const pairs = headerString.split(/\r\n/);
	
	return pairs.reduce((acc, pair) => {
		const splittedPair = pair.split(':');

		return ({
			...acc,
			[splittedPair[0]]: splittedPair[1],
		})
	}, {});
}


const sanitizeOFX = (ofxData) => {
	const messageString = ofxData.split(HEADER_END_REGEX)[1];
	const lines = messageString.split(/\r\n/);
	
	const newLines = lines.map((line) => {
		if (ATTRIBUTE_REGEX.test(line)) {
			const match = line.match(ATTRIBUTE_REGEX);
			const newLine = `${line}</${match[1]}>`;
			return newLine;
		}

		return line;
	});

	return newLines.join('\r\n');
}

const getData = (ofxData) => {
	const xml = sanitizeOFX(ofxData);
	const json = parser.parse(xml);

	return json;
}

const parse = (ofxData) => ({
	header: getHeader(ofxData),
	data: getData(ofxData),
})


module.exports.getHeader = getHeader;
module.exports.getData = getData;
module.exports = {
	parse
};