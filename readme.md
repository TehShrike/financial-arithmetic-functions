A set of functions for doing financial arithmetic.  This is a library you could use to build a friendlier money-math library, like the [financial-number](https://github.com/TehShrike/financial-number) library.

1. Takes bigints only: value + decimal places (d.p.)
2. Does all math with the native [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) implementation
3. Multiplication results have d.p. that is twice the d.p. of their inputs. `9.55` * `1.50` = `14.3250`
4. Addition and subtraction results have a d.p. as great as the highest d.p. of the two inputs. `1.5` + `1.00` = `2.50`

```ts
import * as math from 'financial-arithmetic-functions'
```

<!-- js
const math = require('./')
-->

# Representation of a number

```ts
type FinancialNumberValue = {
	value: bigint
	decimal_places: bigint // >=0
}
```

# functions

## validate(input)

Can you pass it in to any of the other functions?  (i.e. are `value` and `decimal_places` both bigints, and is `decimal_places` >=0)

```js
math.validate({ value: 123n, decimal_places: 0n }) // => true
math.validate({ value: 123444n, decimal_places: 3n }) // => true
math.validate({ value: 123n, decimal_places: -1n }) // => false
math.validate({ value: 123, decimal_places: 0n }) // => false
```

## add(a, b)

```js
math.add({ value: 123n, decimal_places: 0n }, { value: 9999n, decimal_places: 3n }) // => { value: 132999n, decimal_places: 3n }
math.add({ value: 11n, decimal_places: 1n }, { value: 1234n, decimal_places: 3n }) // => { value: 2334n, decimal_places: 3n }
math.add({ value: 5n, decimal_places: 0n }, { value: 987876765654543432321n, decimal_places: 0n }) // => { value: 987876765654543432326n, decimal_places: 0n }
```

## subtract(a, b)

```js
math.subtract({ value: 123n, decimal_places: 0n }, { value: 100n, decimal_places: 0n }) // => { value: 23n, decimal_places: 0n }
math.subtract({ value: 44n, decimal_places: 0n }, { value: -11n, decimal_places: 0n }) // => { value: 55n, decimal_places: 0n }
math.subtract({ value: 10000n, decimal_places: 4n }, { value: 4n, decimal_places: 3n }) // => { value: 9960n, decimal_places: 4n }
```

## multiply(a, b)

```js
math.multiply({ value: 123n, decimal_places: 0n }, { value: 1n, decimal_places: 4n }) // => { value: 123n, decimal_places: 4n }
math.multiply({ value: 9999n, decimal_places: 2n }, { value: 14n, decimal_places: 0n }) // => { value: 139986n, decimal_places: 2n }
```

## modulo(dividend, divisor)

```js
math.modulo({ value: 10n, decimal_places: 0n }, { value: 2n, decimal_places: 0n }) // => { value: 0n, decimal_places: 0n }
math.modulo({ value: 100n, decimal_places: 1n }, { value: 2n, decimal_places: 0n }) // => { value: 0n, decimal_places: 1n }
math.modulo({ value: 1233n, decimal_places: 2n }, { value: 1n, decimal_places: 0n }) // => { value: 33n, decimal_places: 2n }
math.modulo({ value: 1233n, decimal_places: 2n }, { value: 100n, decimal_places: 2n }) // => { value: 33n, decimal_places: 2n }
```

## pow(base, exponent)

```js
math.pow({ value: 2n, decimal_places: 0n }, 3n) // => { value: 8n, decimal_places: 0n }
math.pow({ value: 25n, decimal_places: 1n }, 2n) // => { value: 625n, decimal_places: 2n }
math.pow({ value: 11n, decimal_places: 1n }, 3n) // => { value: 1331n, decimal_places: 3n }
```
