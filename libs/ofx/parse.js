const { XMLParser } = require('fast-xml-parser');

const HEADER_END_REGEX = /\n\n/gm;
const NODE_REGEX = /<([\w]+)>/gm;
const ATTRIBUTE_REGEX = /<([\w]+)>(.+)/;

const parser = new XMLParser();

const sanitizeOFX = (ofxData) => {
	const sanitizedOFXData = ofxData.replace(/\r/gm, '');
	return sanitizedOFXData;
}

const getHeader = (ofxData) => {
	const sanitizedOFX = sanitizeOFX(ofxData);
	const headerString = sanitizedOFX.split(HEADER_END_REGEX)[0];
	const pairs = headerString.split(/\n/);
	
	return pairs.reduce((acc, pair) => {
		const splittedPair = pair.split(':');

		return ({
			...acc,
			[splittedPair[0]]: splittedPair[1],
		})
	}, {});
}

const sanitizeData = (ofxData) => {
	const lines = ofxData.split(/\n/);
	
	const newLines = lines.map((line) => {
		if (ATTRIBUTE_REGEX.test(line)) {
			const match = line.match(ATTRIBUTE_REGEX);
			const newLine = `${line}</${match[1]}>`;
			return newLine;
		}

		return line;
	});

	return newLines.join('\n');
}

const getData = (ofxData) => {
	const data = sanitizeOFX(ofxData);
	const messageString = data.split(HEADER_END_REGEX)[1];
	const xml = sanitizeData(ofxData);
	const json = parser.parse(xml);

	return json;
}

const parse = (ofxData) => ({
	header: getHeader(ofxData),
	data: getData(ofxData),
})


module.exports.getHeader = getHeader;
module.exports.getData = getData;
module.exports.parse = parse;