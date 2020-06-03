A set of functions for doing financial arithmetic.  This is a library you could use to build a friendlier money-math library, like the [financial-number](https://github.com/TehShrike/financial-number) library.

1. Takes strings only
2. Does all math with the native [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) implementation (use 1.x release if you want a version that works in older browsers)
3. Multiplication results have a precision that is twice the precision of their inputs. `9.55` * `1.50` = `14.3250`
4. Addition and subtraction results have a precision as great as the highest precision of the two inputs. `1.5` + `1.00` = `2.50`

Require with `const math = require('financial-arithmetic-functions')`

<!-- js
const math = require('./')
-->

# validate(str)

Can you pass it in to any of the other functions?

```js
math.validate('123') // => true
math.validate('123.444') // => true
math.validate('123.') // => false
math.validate(123) // => false
```

# add(a, b)

```js
math.add('+123', '9.999') // => '132.999'
math.add('1.1', '1.234') // => '2.334'
math.add('5', '987876765654543432321') // => '987876765654543432326'
```

# subtract(a, b)

```js
math.subtract('123', '100') // => '23'
math.subtract('44', '-11') // => '55'
math.subtract('1.0000', '0.004') // => '0.9960'
```

# multiply(a, b)

```js
math.multiply('123', '0.0001') // => '0.0123'
math.multiply('99.99', '14') // => '1399.86'
```

# getPrecision(str)

```js
math.getPrecision('12.666') // => 3
math.getPrecision('999') // => 0
```
