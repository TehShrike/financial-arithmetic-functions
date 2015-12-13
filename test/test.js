var test = require('tape')
var math = require('../')

test('validator', function(t) {
	t.ok(math.validate('123'))
	t.ok(math.validate('123.11'))
	t.ok(math.validate('+123'))
	t.ok(math.validate('+123.123'))
	t.ok(math.validate('-123'))
	t.ok(math.validate('-123.123'))

	t.notOk(math.validate('.123'))
	t.notOk(math.validate('123.'))
	t.notOk(math.validate('.123'))

	t.notOk(math.validate('123e10'))
	t.notOk(math.validate('123a'))
	t.notOk(math.validate('a123'))
	t.notOk(math.validate('+123a'))
	t.notOk(math.validate('-123a'))
	t.notOk(math.validate('+123.a1'))
	t.notOk(math.validate('-123.a1'))
	t.notOk(math.validate('b+123'))
	t.notOk(math.validate('b-123'))
	t.notOk(math.validate('++123'))
	t.notOk(math.validate('+-123'))

	t.notOk(math.validate(123))
	t.notOk(math.validate(123.321))
	t.notOk(math.validate(undefined))
	t.notOk(math.validate(null))
	t.notOk(math.validate({}))

	t.end()
})

test('invalid values throw', function(t) {
	[math.add, math.subtract, math.multiply].forEach(function(fn) {
		t.throws(function() {
			fn('123', '123.')
		})
		t.throws(function() {
			fn('a', '123')
		})
	})

	t.end()
})

test('addition', function(t) {
	t.equal(math.add('123', '100'), '223')
	t.equal(math.add('123.4', '100'), '223.4')
	t.equal(math.add('99999999999999999999999999999999999999999999', '1'), '100000000000000000000000000000000000000000000')
	t.equal(math.add('123.4567', '5.55'), '129.0067')
	t.equal(math.add('0.0001', '0.000000001'), '0.000100001')
	t.end()
})

test('subtraction', function(t) {
	t.equal(math.subtract('123', '100'), '23')
	t.equal(math.subtract('123.4', '100'), '23.4')
	t.equal(math.subtract('99999999999999999999999999999999999999999999', '1'), '99999999999999999999999999999999999999999998')
	t.equal(math.subtract('123.4567', '5.55'), '117.9067')
	t.equal(math.subtract('0.000100001', '0.000000001'), '0.000100000')
	t.end()
})

test('multiplication', function(t) {
	t.equal(math.multiply('123', '100'), '12300')
	t.equal(math.multiply('123.4', '100'), '12340.0')
	t.equal(math.multiply('99999999999999999999999999999999999999999999', '100.0'), '9999999999999999999999999999999999999999999900.0')
	t.equal(math.multiply('123.4567', '5.55'), '685.184685')
	t.equal(math.multiply('9.99', '0.0001'), '0.000999')
	t.end()
})

test('getPrecision', function(t) {
	['848413928457294857', '848484.2', '123124.33', '0.123', '1.4321'].forEach(function(str, i) {
		t.equal(i, math.getPrecision(str))
	})
	t.end()
})

test('no negative zero', function(t) {
	t.equal(math.add('-1', '1'), '0')
	t.equal(math.subtract('1', '1'), '0')
	t.equal(math.multiply('-1', '0'), '0')

	t.equal(math.add('-1', '1.0'), '0.0')
	t.equal(math.subtract('1', '1.0'), '0.0')
	t.equal(math.multiply('-1', '0.0'), '0.0')

	t.end()
})

test('putting the minus symbol in the wrong spot', function(t) {
	t.equal(math.add('-1.00001', '1'), '-0.00001')
	t.equal(math.subtract('13', '13.000001'), '-0.000001')
	t.end()
})
