import { describe, expect, it } from '@jest/globals';
import { product2, product3, product4 } from './';

describe('product2 function', () => {
  it('should return an empty iterator when given empty arrays', () => {
    const result = [...product2([], [])];
    expect(result).toEqual([]);
  });

  it('should return an iterator that yields all pairs of elements from the two arrays', () => {
    const result = product2([1, 2], ['a', 'b']).toArray();
    expect(result).toEqual([
      [1, 'a'],
      [2, 'a'],
      [1, 'b'],
      [2, 'b'],
    ]);
  });

  it('should work with arrays of different lengths', () => {
    const result = [...product2([1, 2, 3], ['a', 'b'])];
    expect(result).toEqual([
      [1, 'a'],
      [2, 'a'],
      [3, 'a'],
      [1, 'b'],
      [2, 'b'],
      [3, 'b'],
    ]);
  });

  it('should work with arrays of different types', () => {
    const result = [...product2(['a', 'b', 'c'], [1, 2])];
    expect(result).toEqual([
      ['a', 1],
      ['b', 1],
      ['c', 1],
      ['a', 2],
      ['b', 2],
      ['c', 2],
    ]);
  });
});

describe('product3 function', () => {
  it('should return an empty iterator when given empty arrays', () => {
    const result = [...product3([], [], [])];
    expect(result).toEqual([]);
  });

  it('should return an iterator that yields all triples of elements from the three arrays', () => {
    const result = product3([1, 2], ['a', 'b'], [true, false]).toArray();
    expect(result).toEqual([
      [1, 'a', true],
      [2, 'a', true],
      [1, 'b', true],
      [2, 'b', true],
      [1, 'a', false],
      [2, 'a', false],
      [1, 'b', false],
      [2, 'b', false],
    ]);
  });
});

describe('product4 function', () => {
  it('should return an iterator that yields all quadruples of elements from the four arrays', () => {
    const result = product4([1, 2], ['a', 'b'], [true, false], ['x', 'y']).toArray();
    expect(result).toEqual([
      [1, 'a', true, 'x'],
      [2, 'a', true, 'x'],
      [1, 'b', true, 'x'],
      [2, 'b', true, 'x'],
      [1, 'a', false, 'x'],
      [2, 'a', false, 'x'],
      [1, 'b', false, 'x'],
      [2, 'b', false, 'x'],
      [1, 'a', true, 'y'],
      [2, 'a', true, 'y'],
      [1, 'b', true, 'y'],
      [2, 'b', true, 'y'],
      [1, 'a', false, 'y'],
      [2, 'a', false, 'y'],
      [1, 'b', false, 'y'],
      [2, 'b', false, 'y'],
    ]);
  });
});
