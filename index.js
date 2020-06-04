const allDigits = /^(-|\+)?\d+$/
const withDecimal = /^(-|\+)?(\d+)\.(\d+)$/

function validate(str) {
	return typeof str === `string` && (allDigits.test(str) || withDecimal.test(str))
}

function validateAndThrow(str) {
	if (!validate(str)) {
		throw new Error(`Invalid input ` + str)
	}
}

function getPrecision(str) {
	if (allDigits.test(str)) {
		return 0
	} else {
		return str.split(`.`)[1].length
	}
}

function add(a, b) {
	validateAndThrow(a)
	validateAndThrow(b)
	const normalized = normalizeToSamePrecision(a, b)

	const sum = (BigInt(normalized.a) + BigInt(normalized.b)).toString()

	return normalized.precision > 0 ? addDecimal(sum, normalized.precision) : sum
}

function subtract(a, b) {
	validateAndThrow(a)
	validateAndThrow(b)

	const normalized = normalizeToSamePrecision(a, b)

	const result = (BigInt(normalized.a) - BigInt(normalized.b)).toString()

	return normalized.precision > 0 ? addDecimal(result, normalized.precision) : result
}

function multiply(a, b) {
	validateAndThrow(a)
	validateAndThrow(b)

	const normalized = normalizeToLargeEnoughPrecisionToMultiply(a, b)

	const result = (BigInt(normalized.a) * BigInt(normalized.b)).toString()

	return normalized.precision > 0 ? addDecimal(result, normalized.precision) : result
}

function division(a, b, precision) {
	validateAndThrow(a)
	validateAndThrow(b)
	if (typeof precision !== 'number' || !isFinite(precision) || precision < 0 || Math.floor(precision) !== precision) {
		precision = 0
	}

	const normalized = normalizeToSamePrecision(a, b)

	const result = JSBI.divide(JSBI.BigInt(padWithZeroes(normalized.a, precision)), JSBI.BigInt(normalized.b)).toString()

	return precision ? addDecimal(result, precision) : result
}

module.exports = {
	validate,
	add,
	subtract,
	multiply,
	division,
	getPrecision,
}

function normalizeToSamePrecision(a, b) {
	const precisionA = getPrecision(a)
	const precisionB = getPrecision(b)
	const differenceInPrecisions = diff(precisionA, precisionB)
	const precision = Math.max(precisionA, precisionB)

	if (precisionA > precisionB) {
		b = padWithZeroes(b, differenceInPrecisions)
	} else if (precisionB > precisionA) {
		a = padWithZeroes(a, differenceInPrecisions)
	}

	return {
		a: stripDecimal(a),
		b: stripDecimal(b),
		precision,
	}
}

function normalizeToLargeEnoughPrecisionToMultiply(a, b) {
	const precisionA = getPrecision(a)
	const precisionB = getPrecision(b)
	const precision = precisionA + precisionB

	return {
		a: stripDecimal(a),
		b: stripDecimal(b),
		precision,
	}
}


function diff(a, b) {
	return a > b ? (a - b) : (b - a)
}

function padWithZeroes(str, newZeroes) {
	while (newZeroes > 0) {
		str += `0`
		newZeroes--
	}
	return str
}

function stripDecimal(str) {
	return str.replace(`.`, ``)
}

function addDecimal(str, position) {
	const isNegative = str[0] === `-`
	if (isNegative) {
		str = str.substring(1)
	}

	while (str.length < position + 1) {
		str = `0` + str
	}
	const beforeTheDecimal = str.length - position
	let newNumber = str.substring(0, beforeTheDecimal) + `.` + str.substring(beforeTheDecimal)
	if (isNegative) {
		newNumber = `-` + newNumber
	}
	return newNumber
}
