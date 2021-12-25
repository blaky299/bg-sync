const { parseDate, parseAmmount } = require('../libs/ofx/utils');

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

module.exports.getTransactions = getTransactions;