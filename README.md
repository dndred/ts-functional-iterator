# functional-iterator

Python-like iterator for JavaScript.
The library implements lazy iteration over arrays and provides functions `.map`, `.filter`, and `.reduce` on the iterator.

Chaining doesn't copy arrays on each step and doesn't waste memory. Real calculations perform only on actual data consuming - on reduce, join, and toArray calls.

```ts
funcIterator([1, 2, 3, 4, 5])
  .map((el) => el * 2)
  .filter((el) => el > 3)
  .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
```

test commit
