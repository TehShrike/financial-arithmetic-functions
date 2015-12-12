var BigInteger = require('jsbn').BigInteger

var allDigits = /^(-|\+)?\d+$/
var withDecimal = /^(-|\+)?(\d+)\.(\d+)$/

function validate(str) {
	return typeof str === 'string' && (allDigits.test(str) || withDecimal.test(str))
}

function validateAndThrow(str) {
	if (!validate(str)) {
		throw new Error('Invalid input ' + str)
	}
}

function getPrecision(str) {
	if (allDigits.test(str)) {
		return 0
	} else {
		return str.split('.')[1].length
	}
}

function add(a, b) {
	validateAndThrow(a)
	validateAndThrow(b)
	var normalized = normalizeToSamePrecision(a, b)

	var sum = new BigInteger(normalized.a).add(new BigInteger(normalized.b)).toString()

	return normalized.precision > 0 ? addDecimal(sum, normalized.precision) : sum
}

function subtract(a, b) {
	validateAndThrow(a)
	validateAndThrow(b)

	var normalized = normalizeToSamePrecision(a, b)

	var result = new BigInteger(normalized.a).subtract(new BigInteger(normalized.b)).toString()

	return normalized.precision > 0 ? addDecimal(result, normalized.precision) : result
}

function multiply(a, b) {
	validateAndThrow(a)
	validateAndThrow(b)

	var normalized = normalizeToLargeEnoughPrecisionToMultiply(a, b)

	var result = new BigInteger(normalized.a).multiply(new BigInteger(normalized.b)).toString()

	return normalized.precision > 0 ? addDecimal(result, normalized.precision) : result
}

module.exports.validate = validate
module.exports.add = add
module.exports.subtract = subtract
module.exports.multiply = multiply
module.exports.getPrecision = getPrecision

function normalizeToSamePrecision(a, b) {
	var precisionA = getPrecision(a)
	var precisionB = getPrecision(b)
	var differenceInPrecisions = diff(precisionA, precisionB)
	var precision = Math.max(precisionA, precisionB)

	if (precisionA > precisionB) {
		b = padWithZeroes(b, differenceInPrecisions)
	} else if (precisionB > precisionA) {
		a = padWithZeroes(a, differenceInPrecisions)
	}

	return {
		a: stripDecimal(a),
		b: stripDecimal(b),
		precision: precision
	}
}

function normalizeToLargeEnoughPrecisionToMultiply(a, b) {
	var precisionA = getPrecision(a)
	var precisionB = getPrecision(b)
	var precision = precisionA + precisionB

	return {
		a: stripDecimal(a),
		b: stripDecimal(b),
		precision: precision
	}
}


function diff(a, b) {
	return a > b ? (a - b) : (b - a)
}

function padWithZeroes(str, newZeroes) {
	while (newZeroes > 0) {
		str += '0'
		newZeroes--
	}
	return str
}

function stripDecimal(str) {
	return str.replace('.', '')
}

function addDecimal(str, position) {
	while (str.length < position + 1) {
		str = '0' + str
	}
	var beforeTheDecimal = str.length - position
	return str.substring(0, beforeTheDecimal) + '.' + str.substring(beforeTheDecimal)
}
