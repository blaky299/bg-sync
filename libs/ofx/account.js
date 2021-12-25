const getAccountType = (ofxData) => {
	const accType = ofxData.OFX?.BANKMSGSRSV1?.STMTTRNRS.STMTRS.BANKACCTFROM.ACCTTYPE ?? 'CC';

	return accType;
}

const getAccountNode = (statementNode, accountType) => {
	return accountType === 'CC' ?
		statementNode.CCACCTFROM :
		statementNode.BANKACCTFROM;		
}

module.exports.getAccountType = getAccountType;
module.exports.getAccountNode = getAccountNode;