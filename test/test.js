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
	[math.add, math.subtract].forEach(function(fn) {
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
	t.end()
})

test('subtraction', function(t) {
	t.equal(math.subtract('123', '100'), '23')
	t.equal(math.subtract('123.4', '100'), '23.4')
	t.equal(math.subtract('99999999999999999999999999999999999999999999', '1'), '99999999999999999999999999999999999999999998')
	t.equal(math.subtract('123.4567', '5.55'), '117.9067')
	t.end()
})
