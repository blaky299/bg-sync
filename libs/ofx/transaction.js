const parse = require('date-fns/parse');

const OFX_DATE_FORMAT = 'yyyyMMddHHmmss';

// return date as a timestamp
const parseDate = (dateStr) => {
	/* found another silly thing here, this date is the real transaction date,
	*  but not the real transaction time, it is the transaction date + the statement time ... 
	*/
	return parse(dateStr, OFX_DATE_FORMAT, Date.now());
}

// return ammount in cents
const parseAmmount = (ammount) => {
	return ammount * 100;
}

// Move to account.js
const getAccountType = (ofxData) => {
	const accType = ofxData.OFX?.BANKMSGSRSV1?.STMTTRNRS.STMTRS.BANKACCTFROM.ACCTTYPE ?? 'CC';

	return accType;
}

// Move to statement.js
const getStatementNode = (ofxData, accountType) => {
	return accountType === 'CC' ?
		ofxData.OFX?.CREDITCARDMSGSRSV1?.CCSTMTTRNRS.CCSTMTRS :
		ofxData.OFX?.BANKMSGSRSV1?.STMTTRNRS.STMTRS;		
}

// Move to account.js
const getAccountNode = (statementNode, accountType) => {
	return accountType === 'CC' ?
		statementNode.CCACCTFROM :
		statementNode.BANKACCTFROM;		
}
// Move to src/account.js
const getAccount = (statementNode, accountType) => {
	const accountNode = getAccountNode(statementNode, accountType);


	return ({
		id: accountNode.ACCTID,
		bankId: accountNode.ACCTTYPE,
		accountType,
	});
}

// move to src/statement.js
const getStatement = (ofxData) => {
	const accountType = getAccountType(ofxData);
	const statementNode = getStatementNode(ofxData, accountType);
	const account = getAccount(statementNode, accountType);

	return ({
		account,
		currency: statementNode.CURDEF ?? 'USD',
		transactions: getTransactions(statementNode?.BANKTRANLIST),
		// credit cards don't have statements bg_rant#1
		balance: statementNode.LEDGERBAL?.BALAMT ?? null,
		date: statementNode.LEDGERBAL?.BALAMT ? parseDate(statementNode?.LEDGERBAL?.BALAMT) : Date.now(),
	});
}

// move to src/transactions.js
const getTransactions = (transactionsNode, accountFrom) => {
	const ofxTransactions = transactionsNode?.STMTTRN ?? [];
	const transactions = ofxTransactions.map((t) =>  ({
		id: t.FITID, // this only works between BG accounts bg_rant#4
		reference: t.REFNUM,
		type: t.TRNTYPE, // This is almost useful thanks BG ... bg_rant#2
		date: parseDate(t.DTPOSTED), 
		ammount: parseAmmount(t.TRNAMT),
		memo: t.MEMO,
		accountTo: null, // BG at it again will have to match it from the MEMO ... bg_rant#3
		meta: {}, // gonna use this to store metadata for banks and providers
	}));

	return ({
		dateStart: parseDate(transactionsNode.DTSTART),
		dateEnd: parseDate(transactionsNode.DTEND),
		transactions,
	});
}

module.exports.getStatement = getStatement;