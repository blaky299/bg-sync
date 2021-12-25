const { getAccountNode } = require('../libs/ofx/account');

const getAccount = (statementNode, accountType) => {
	const accountNode = getAccountNode(statementNode, accountType);


	return ({
		id: accountNode.ACCTID,
		bankId: accountNode.ACCTTYPE,
		accountType,
	});
}

module.exports.getAccount = getAccount;