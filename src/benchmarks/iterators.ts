import funcIterator from '../';

const arr = Array.from({ length: 10e7 }, () => Math.floor(Math.random() * 10));

funcIterator(arr)
  .map((v) => v + 1)
  .map((v) => v + 1)
  .map((v) => v + 1)
  .filter((v) => v > 0)
  .reduce((acc, value) => acc + value, 0);
