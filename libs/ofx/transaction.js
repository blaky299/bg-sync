const getTransactionsNode = (statementNode) => {
	return statementNode?.BANKTRANLIST;
}

module.exports.getTransactionsNode = getTransactionsNode;