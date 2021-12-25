const { getAccountType } = require('../libs/ofx/account');
const { getStatementNode } = require('../libs/ofx/statement');
const { getTransactionsNode } = require('../libs/ofx/transaction');
const { parseDate } = require('../libs/ofx/utils');
const { getAccount } = require('./account');
const { getTransactions } = require('./transaction');

const getStatement = (ofxData) => {
	const accountType = getAccountType(ofxData);
	const statementNode = getStatementNode(ofxData, accountType);
	const account = getAccount(statementNode, accountType);

	return ({
		account,
		currency: statementNode.CURDEF ?? 'USD',
		transactions: getTransactions(getTransactionsNode(statementNode)),
		// credit cards don't have statements bg_rant#1
		balance: statementNode.LEDGERBAL?.BALAMT ?? null,
		date: statementNode.LEDGERBAL?.BALAMT ? parseDate(statementNode?.LEDGERBAL?.BALAMT) : Date.now(),
	});
}

module.exports.getStatement = getStatement;