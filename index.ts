type FinancialNumberValue = {
	value: bigint
	decimal_places: bigint
}

export function validate(input: unknown): input is FinancialNumberValue {
	return typeof input === `object` && input !== null && 'value' in input && 'decimal_places' in input && typeof input.value === 'bigint' && typeof input.decimal_places === 'bigint' && input.decimal_places >= 0n
}

export function add(a: FinancialNumberValue, b: FinancialNumberValue): FinancialNumberValue {
	const normalized = normalizeToSamePrecision(a, b)

	return {
		value: normalized.a + normalized.b,
		decimal_places: normalized.decimal_places,
	}
}

export function subtract(a: FinancialNumberValue, b: FinancialNumberValue): FinancialNumberValue {
	const normalized = normalizeToSamePrecision(a, b)

	return {
		value: normalized.a - normalized.b,
		decimal_places: normalized.decimal_places,
	}
}

export function multiply(a: FinancialNumberValue, b: FinancialNumberValue): FinancialNumberValue {
	return {
		value: a.value * b.value,
		decimal_places: a.decimal_places + b.decimal_places,
	}
}

export function modulo(dividend: FinancialNumberValue, divisor: FinancialNumberValue): FinancialNumberValue {
	const normalized = normalizeToSamePrecision(dividend, divisor)

	return {
		value: normalized.a % normalized.b,
		decimal_places: normalized.decimal_places,
	}
}

export function pow(base: FinancialNumberValue, exponent: bigint): FinancialNumberValue {
	return {
		value: base.value ** exponent,
		decimal_places: base.decimal_places * exponent,
	}
}

function normalizeToSamePrecision(a: FinancialNumberValue, b: FinancialNumberValue) {
	const decimal_places = a.decimal_places > b.decimal_places ? a.decimal_places : b.decimal_places
	const differenceA = decimal_places - a.decimal_places
	const differenceB = decimal_places - b.decimal_places

	return {
		a: a.value * (10n ** differenceA),
		b: b.value * (10n ** differenceB),
		decimal_places,
	}
}
