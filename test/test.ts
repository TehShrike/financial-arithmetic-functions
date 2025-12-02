import { test } from 'node:test'
import { strictEqual, deepStrictEqual } from 'node:assert'
import * as math from '../index.ts'

const n = (value: bigint, decimal_places: bigint) => ({ value, decimal_places })

test(`validator`, () => {
	strictEqual(math.validate(n(123n, 0n)), true)
	strictEqual(math.validate(n(12311n, 2n)), true)
	strictEqual(math.validate(n(123n, 0n)), true)
	strictEqual(math.validate(n(123123n, 3n)), true)
	strictEqual(math.validate(n(-123n, 0n)), true)
	strictEqual(math.validate(n(-123123n, 3n)), true)

	strictEqual(math.validate(n(123n, -1n)), false)
	strictEqual(math.validate({ value: 123, decimal_places: 0n }), false)
	strictEqual(math.validate({ value: 123n, decimal_places: 0 }), false)

	strictEqual(math.validate(123), false)
	strictEqual(math.validate(123.321), false)
	strictEqual(math.validate(undefined), false)
	strictEqual(math.validate(null), false)
	strictEqual(math.validate({}), false)
})

test(`addition`, () => {
	deepStrictEqual(math.add(n(123n, 0n), n(100n, 0n)), n(223n, 0n))
	deepStrictEqual(math.add(n(1234n, 1n), n(100n, 0n)), n(2234n, 1n))
	deepStrictEqual(math.add(n(99999999999999999999999999999999999999999999n, 0n), n(1n, 0n)), n(100000000000000000000000000000000000000000000n, 0n))
	deepStrictEqual(math.add(n(1234567n, 4n), n(555n, 2n)), n(1290067n, 4n))
	deepStrictEqual(math.add(n(1n, 4n), n(1n, 9n)), n(100001n, 9n))
})

test(`subtraction`, () => {
	deepStrictEqual(math.subtract(n(123n, 0n), n(100n, 0n)), n(23n, 0n))
	deepStrictEqual(math.subtract(n(1234n, 1n), n(100n, 0n)), n(234n, 1n))
	deepStrictEqual(math.subtract(n(99999999999999999999999999999999999999999999n, 0n), n(1n, 0n)), n(99999999999999999999999999999999999999999998n, 0n))
	deepStrictEqual(math.subtract(n(1234567n, 4n), n(555n, 2n)), n(1179067n, 4n))
	deepStrictEqual(math.subtract(n(100001n, 9n), n(1n, 9n)), n(100000n, 9n))
})

test(`multiplication`, () => {
	deepStrictEqual(math.multiply(n(123n, 0n), n(100n, 0n)), n(12300n, 0n))
	deepStrictEqual(math.multiply(n(1234n, 1n), n(100n, 0n)), n(123400n, 1n))
	deepStrictEqual(math.multiply(n(99999999999999999999999999999999999999999999n, 0n), n(1000n, 1n)), n(99999999999999999999999999999999999999999999000n, 1n))
	deepStrictEqual(math.multiply(n(1234567n, 4n), n(555n, 2n)), n(685184685n, 6n))
	deepStrictEqual(math.multiply(n(999n, 2n), n(1n, 4n)), n(999n, 6n))
})

test(`modulo`, () => {
	deepStrictEqual(math.modulo(n(10n, 0n), n(2n, 0n)), n(0n, 0n))
	deepStrictEqual(math.modulo(n(10n, 0n), n(3n, 0n)), n(1n, 0n))
	deepStrictEqual(math.modulo(n(100n, 1n), n(2n, 0n)), n(0n, 1n))
	deepStrictEqual(math.modulo(n(1233n, 2n), n(1n, 0n)), n(33n, 2n))
	deepStrictEqual(math.modulo(n(1233n, 2n), n(100n, 2n)), n(33n, 2n))
})

test(`pow`, () => {
	deepStrictEqual(math.pow(n(2n, 0n), 3n), n(8n, 0n))
	deepStrictEqual(math.pow(n(25n, 1n), 2n), n(625n, 2n))
	deepStrictEqual(math.pow(n(11n, 1n), 3n), n(1331n, 3n))
	deepStrictEqual(math.pow(n(10n, 0n), 0n), n(1n, 0n))
	deepStrictEqual(math.pow(n(5n, 2n), 1n), n(5n, 2n))
})
