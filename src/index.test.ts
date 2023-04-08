import { describe, expect, it } from '@jest/globals';
import funcIterator, { product } from './';

describe('funcIterator', () => {
  const array = [1, 2, 3];

  it('Next', () => {
    const iter = funcIterator(array);
    expect(iter.next()).toStrictEqual({ value: 1, done: false });
    expect(iter.next()).toStrictEqual({ value: 2, done: false });
    expect(iter.next()).toStrictEqual({ value: 3, done: false });
    expect(iter.next()).toStrictEqual({ value: undefined, done: true });
    expect(iter.next()).toStrictEqual({ value: undefined, done: true });
  });

  it('Join', () => {
    let iter = funcIterator(array);
    expect(iter.join()).toBe('1,2,3');

    iter = funcIterator(array);
    expect(iter.join('.')).toBe('1.2.3');
  });

  it('toJoinArray', () => {
    const iter = funcIterator(array);
    expect(iter.toArray()).toStrictEqual([1, 2, 3]);
  });

  it('Empty after usage', () => {
    const iter = funcIterator(array);
    iter.toArray();
    expect(iter.toArray()).toStrictEqual([]);
  });

  it('Create from iterable', () => {
    const iter = funcIterator(funcIterator(array));
    expect(iter.toArray()).toStrictEqual([1, 2, 3]);
  });

  it('Create from generator', () => {
    const iter = funcIterator(
      (function* () {
        yield 1;
        yield 2;
        yield 3;
      })(),
    );
    expect(iter.toArray()).toStrictEqual([1, 2, 3]);
  });

  it('map', () => {
    const iter = funcIterator(array);
    expect(iter.map((el) => el * 2).toArray()).toStrictEqual([2, 4, 6]);
  });

  it('for of map', () => {
    const filter = funcIterator(array).map((el) => el * 2);
    const values: number[] = [];
    for (const value of filter) {
      values.push(value);
    }
    expect(values).toStrictEqual([2, 4, 6]);
  });

  it('filter', () => {
    const iter = funcIterator(array);
    expect(iter.filter((el) => el !== 2).toArray()).toStrictEqual([1, 3]);
  });

  it('for of filter', () => {
    const filter = funcIterator(array).filter((el) => el !== 2);
    const values: number[] = [];
    for (const value of filter) {
      values.push(value);
    }
    expect(values).toStrictEqual([1, 3]);
  });

  it('filter empty', () => {
    const filter = funcIterator([]).filter((el) => el);
    expect(filter.toArray()).toStrictEqual([]);
  });

  it('reduce', () => {
    const iter = funcIterator(array);
    const indexes: number[] = [];
    expect(
      iter.reduce((previousValue, currentValue, currentIndex) => {
        indexes.push(currentIndex);
        return previousValue + currentValue;
      }, 10),
    ).toBe(16);
    expect(indexes).toStrictEqual([0, 1, 2]);
  });

  it('reduce without initial value', () => {
    const iter = funcIterator(array);
    expect(
      iter.reduce((previousValue, currentValue) => {
        return (previousValue ?? 0) + currentValue;
      }),
    ).toBe(6);
  });

  it('reduce with type change', () => {
    const iter = funcIterator(array);
    expect(
      iter.reduce((previousValue, currentValue) => {
        return previousValue + currentValue.toString();
      }, '='),
    ).toBe('=123');
  });

  it('Chaining', () => {
    expect(
      funcIterator(array)
        .map((el) => el * 2)
        .filter((el) => el > 3)
        .reduce((previousValue, currentValue) => previousValue + currentValue, 10),
    ).toBe(20);
  });

  it('length', () => {
    let iter = funcIterator(array);
    expect(iter.length()).toBe(3);
    expect(iter.length()).toBe(0);

    iter = funcIterator(array);
    iter.next();
    expect(iter.length()).toBe(2);

    iter = funcIterator([]);
    expect(iter.length()).toBe(0);
  });

  it('array like', () => {
    let iter = funcIterator<number>({ length: 3 });
    expect(iter.map((_, index) => index).toArray()).toStrictEqual([0, 1, 2]);

    iter = funcIterator(Array.from({ length: 3 }));
    expect(iter.map((_, index) => index).toArray()).toStrictEqual([0, 1, 2]);
  });

  describe('product function', () => {
    it('should return an empty iterator when given empty arrays', () => {
      const result = [...product([], [])];
      expect(result).toEqual([]);
    });

    it('should return an iterator that yields all pairs of elements from the two arrays', () => {
      const result = product([1, 2], ['a', 'b']).toArray();
      expect(result).toEqual([
        [1, 'a'],
        [1, 'b'],
        [2, 'a'],
        [2, 'b'],
      ]);
    });

    it('should work with arrays of different lengths', () => {
      const result = [...product([1, 2, 3], ['a', 'b'])];
      expect(result).toEqual([
        [1, 'a'],
        [1, 'b'],
        [2, 'a'],
        [2, 'b'],
        [3, 'a'],
        [3, 'b'],
      ]);
    });

    it('should work with arrays of different types', () => {
      const result = [...product([1, 2], ['a', 'b', 'c'])];
      expect(result).toEqual([
        [1, 'a'],
        [1, 'b'],
        [1, 'c'],
        [2, 'a'],
        [2, 'b'],
        [2, 'c'],
      ]);
    });
  });
});
