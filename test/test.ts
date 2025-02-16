import * as t from 'uvu/assert'
import * as math from '../index'

type TestFunction = (_t: typeof t) => void

const test = (name: string, fn: TestFunction) => {
	console.log(name + `...`)
	fn(t)
	console.log(`✅`)
}

test(`validator`, t => {
	t.is(math.validate(`123`), true)
	t.is(math.validate(`123.11`), true)
	t.is(math.validate(`+123`), true)
	t.is(math.validate(`+123.123`), true)
	t.is(math.validate(`-123`), true)
	t.is(math.validate(`-123.123`), true)

	t.not.ok(math.validate(`.123`))
	t.not.ok(math.validate(`123.`))
	t.not.ok(math.validate(`.123`))

	t.not.ok(math.validate(`123e10`))
	t.not.ok(math.validate(`123a`))
	t.not.ok(math.validate(`a123`))
	t.not.ok(math.validate(`+123a`))
	t.not.ok(math.validate(`-123a`))
	t.not.ok(math.validate(`+123.a1`))
	t.not.ok(math.validate(`-123.a1`))
	t.not.ok(math.validate(`b+123`))
	t.not.ok(math.validate(`b-123`))
	t.not.ok(math.validate(`++123`))
	t.not.ok(math.validate(`+-123`))

	t.not.ok(math.validate(123))
	t.not.ok(math.validate(123.321))
	t.not.ok(math.validate(undefined))
	t.not.ok(math.validate(null))
	t.not.ok(math.validate({}))
})

test(`invalid values throw`, t => {
	[ math.add, math.subtract, math.multiply ].forEach(fn => {
		t.throws(() => {
			fn(`123`, `123.`)
		})
		t.throws(() => {
			fn(`a`, `123`)
		})
	})
})

test(`addition`, t => {
	t.equal(math.add(`123`, `100`), `223`)
	t.equal(math.add(`123.4`, `100`), `223.4`)
	t.equal(math.add(`99999999999999999999999999999999999999999999`, `1`), `100000000000000000000000000000000000000000000`)
	t.equal(math.add(`123.4567`, `5.55`), `129.0067`)
	t.equal(math.add(`0.0001`, `0.000000001`), `0.000100001`)
})

test(`subtraction`, t => {
	t.equal(math.subtract(`123`, `100`), `23`)
	t.equal(math.subtract(`123.4`, `100`), `23.4`)
	t.equal(math.subtract(`99999999999999999999999999999999999999999999`, `1`), `99999999999999999999999999999999999999999998`)
	t.equal(math.subtract(`123.4567`, `5.55`), `117.9067`)
	t.equal(math.subtract(`0.000100001`, `0.000000001`), `0.000100000`)
})

test(`multiplication`, t => {
	t.equal(math.multiply(`123`, `100`), `12300`)
	t.equal(math.multiply(`123.4`, `100`), `12340.0`)
	t.equal(math.multiply(`99999999999999999999999999999999999999999999`, `100.0`), `9999999999999999999999999999999999999999999900.0`)
	t.equal(math.multiply(`123.4567`, `5.55`), `685.184685`)
	t.equal(math.multiply(`9.99`, `0.0001`), `0.000999`)
})

test(`getPrecision`, t => {
	[ `848413928457294857`, `848484.2`, `123124.33`, `0.123`, `1.4321` ].forEach((str, i) => {
		t.equal(i, math.getPrecision(str))
	})
})

test(`no negative zero`, t => {
	t.equal(math.add(`-1`, `1`), `0`)
	t.equal(math.subtract(`1`, `1`), `0`)
	t.equal(math.multiply(`-1`, `0`), `0`)

	t.equal(math.add(`-1`, `1.0`), `0.0`)
	t.equal(math.subtract(`1`, `1.0`), `0.0`)
	t.equal(math.multiply(`-1`, `0.0`), `0.0`)
})

test(`putting the minus symbol in the wrong spot`, t => {
	t.equal(math.add(`-1.00001`, `1`), `-0.00001`)
	t.equal(math.subtract(`13`, `13.000001`), `-0.000001`)
})

test(`modulo`, t => {
	t.equal(math.modulo(`10`, `2`), `0`)
	t.equal(math.modulo(`10`, `3`), `1`)
	t.equal(math.modulo(`10.0`, `2`), `0.0`)
	t.equal(math.modulo(`12.33`, `1`), `0.33`)
	t.equal(math.modulo(`12.33`, `1.00`), `0.33`)
})
