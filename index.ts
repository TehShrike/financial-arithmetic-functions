const allDigits = /^(-|\+)?\d+$/
const withDecimal = /^(-|\+)?(\d+)\.(\d+)$/

export function validate(str: any) {
	return typeof str === `string` && (allDigits.test(str) || withDecimal.test(str))
}

function validateAndThrow(str: string) {
	if (!validate(str)) {
		throw new Error(`Invalid input ` + str)
	}
}

export function getPrecision(str: string) {
	if (allDigits.test(str)) {
		return 0
	} else {
		return str.split(`.`)[1].length
	}
}

export function add(a: string, b: string) {
	validateAndThrow(a)
	validateAndThrow(b)
	const normalized = normalizeToSamePrecision(a, b)

	const sum = (BigInt(normalized.a) + BigInt(normalized.b)).toString()

	return normalized.precision > 0 ? addDecimal(sum, normalized.precision) : sum
}

export function subtract(a: string, b: string) {
	validateAndThrow(a)
	validateAndThrow(b)

	const normalized = normalizeToSamePrecision(a, b)

	const result = (BigInt(normalized.a) - BigInt(normalized.b)).toString()

	return normalized.precision > 0 ? addDecimal(result, normalized.precision) : result
}

export function multiply(a: string, b: string) {
	validateAndThrow(a)
	validateAndThrow(b)

	const normalized = normalizeToLargeEnoughPrecisionToMultiply(a, b)

	const result = (BigInt(normalized.a) * BigInt(normalized.b)).toString()

	return normalized.precision > 0 ? addDecimal(result, normalized.precision) : result
}


export function modulo(dividend: string, divisor: string) {
	validateAndThrow(dividend)
	validateAndThrow(divisor)

	const normalized = normalizeToSamePrecision(dividend, divisor)

	const result = (BigInt(normalized.a) % BigInt(normalized.b)).toString()

	return normalized.precision > 0 ? addDecimal(result, normalized.precision) : result
}

function normalizeToSamePrecision(a: string, b: string) {
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

function normalizeToLargeEnoughPrecisionToMultiply(a: string, b: string) {
	const precisionA = getPrecision(a)
	const precisionB = getPrecision(b)
	const precision = precisionA + precisionB

	return {
		a: stripDecimal(a),
		b: stripDecimal(b),
		precision,
	}
}


function diff(a: number, b: number) {
	return a > b ? (a - b) : (b - a)
}

function padWithZeroes(str: string, newZeroes: number) {
	while (newZeroes > 0) {
		str += `0`
		newZeroes--
	}
	return str
}

function stripDecimal(str: string) {
	return str.replace(`.`, ``)
}

function addDecimal(str: string, position: number) {
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
