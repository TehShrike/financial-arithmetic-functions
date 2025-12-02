import * as t from 'uvu/assert'
import * as math from '../index'

type TestFunction = (_t: typeof t) => void

const test = (name: string, fn: TestFunction) => {
	console.log(name + `...`)
	fn(t)
	console.log(`✅`)
}

const n = (value: bigint, decimal_places: bigint) => ({ value, decimal_places })

test(`validator`, t => {
	t.is(math.validate(n(123n, 0n)), true)
	t.is(math.validate(n(12311n, 2n)), true)
	t.is(math.validate(n(123n, 0n)), true)
	t.is(math.validate(n(123123n, 3n)), true)
	t.is(math.validate(n(-123n, 0n)), true)
	t.is(math.validate(n(-123123n, 3n)), true)

	t.not.ok(math.validate(n(123n, -1n)))
	t.not.ok(math.validate({ value: 123, precision: 0n }))
	t.not.ok(math.validate({ value: 123n, precision: 0 }))

	t.not.ok(math.validate(123))
	t.not.ok(math.validate(123.321))
	t.not.ok(math.validate(undefined))
	t.not.ok(math.validate(null))
	t.not.ok(math.validate({}))
})

test(`addition`, t => {
	t.equal(math.add(n(123n, 0n), n(100n, 0n)), n(223n, 0n))
	t.equal(math.add(n(1234n, 1n), n(100n, 0n)), n(2234n, 1n))
	t.equal(math.add(n(99999999999999999999999999999999999999999999n, 0n), n(1n, 0n)), n(100000000000000000000000000000000000000000000n, 0n))
	t.equal(math.add(n(1234567n, 4n), n(555n, 2n)), n(1290067n, 4n))
	t.equal(math.add(n(1n, 4n), n(1n, 9n)), n(100001n, 9n))
})

test(`subtraction`, t => {
	t.equal(math.subtract(n(123n, 0n), n(100n, 0n)), n(23n, 0n))
	t.equal(math.subtract(n(1234n, 1n), n(100n, 0n)), n(234n, 1n))
	t.equal(math.subtract(n(99999999999999999999999999999999999999999999n, 0n), n(1n, 0n)), n(99999999999999999999999999999999999999999998n, 0n))
	t.equal(math.subtract(n(1234567n, 4n), n(555n, 2n)), n(1179067n, 4n))
	t.equal(math.subtract(n(100001n, 9n), n(1n, 9n)), n(100000n, 9n))
})

test(`multiplication`, t => {
	t.equal(math.multiply(n(123n, 0n), n(100n, 0n)), n(12300n, 0n))
	t.equal(math.multiply(n(1234n, 1n), n(100n, 0n)), n(123400n, 1n))
	t.equal(math.multiply(n(99999999999999999999999999999999999999999999n, 0n), n(1000n, 1n)), n(99999999999999999999999999999999999999999999000n, 1n))
	t.equal(math.multiply(n(1234567n, 4n), n(555n, 2n)), n(685184685n, 6n))
	t.equal(math.multiply(n(999n, 2n), n(1n, 4n)), n(999n, 6n))
})

test(`modulo`, t => {
	t.equal(math.modulo(n(10n, 0n), n(2n, 0n)), n(0n, 0n))
	t.equal(math.modulo(n(10n, 0n), n(3n, 0n)), n(1n, 0n))
	t.equal(math.modulo(n(100n, 1n), n(2n, 0n)), n(0n, 1n))
	t.equal(math.modulo(n(1233n, 2n), n(1n, 0n)), n(33n, 2n))
	t.equal(math.modulo(n(1233n, 2n), n(100n, 2n)), n(33n, 2n))
})

test(`pow`, t => {
	t.equal(math.pow(n(2n, 0n), 3n), n(8n, 0n))
	t.equal(math.pow(n(25n, 1n), 2n), n(625n, 2n))
	t.equal(math.pow(n(11n, 1n), 3n), n(1331n, 3n))
	t.equal(math.pow(n(10n, 0n), 0n), n(1n, 0n))
	t.equal(math.pow(n(5n, 2n), 1n), n(5n, 2n))
})
