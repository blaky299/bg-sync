const getStatementNode = (ofxData, accountType) => {
	return accountType === 'CC' ?
		ofxData.OFX?.CREDITCARDMSGSRSV1?.CCSTMTTRNRS.CCSTMTRS :
		ofxData.OFX?.BANKMSGSRSV1?.STMTTRNRS.STMTRS;		
}

module.exports.getStatementNode = getStatementNode;