const ofxParser = require('../libs/ofx-parser');
const { readFile, writeFile } = require('fs/promises');

const run = async () => {
	const ofxXMLData = await readFile('statements/credit-card.ofx', 'utf-8');
	const data = ofxParser.parse(ofxXMLData);

	await writeFile('statements/result.json', JSON.stringify(data.data));
}

module.exports = run;
