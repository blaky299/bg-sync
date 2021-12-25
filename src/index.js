const parser = require('../libs/ofx/parse');
const { getStatement } = require('./statement');

const { readFile, writeFile } = require('fs/promises');

const run = async () => {
	const creditCardOFX = await readFile('statements/credit-card.ofx', 'utf-8');
	const creditCardData = parser.parse(creditCardOFX);
	const creditCardStatement = getStatement(creditCardData.data)

	await writeFile('statements/credit-card.json', JSON.stringify(creditCardData.data));
	await writeFile('statements/credit-card-statement.json', JSON.stringify(creditCardStatement));

	const bankAccountOFX = await readFile('statements/savings.ofx', 'utf-8');
	const bankAccountData = parser.parse(bankAccountOFX);
	const bankAccountStatement = getStatement(bankAccountData.data);

	await writeFile('statements/savings.json', JSON.stringify(bankAccountData.data));
	await writeFile('statements/savings-statement.json', JSON.stringify(bankAccountStatement));	
}

module.exports = run;
