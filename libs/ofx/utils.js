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

module.exports.parseAmmount = parseAmmount;
module.exports.parseDate = parseDate;