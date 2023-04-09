const iterationDone: { done: true; value: undefined } = {
  done: true,
  value: undefined,
};

const arrayIterator = <T>(array: ArrayLike<T>): IterableIterator<T> => {
  let index = 0;
  const iterator = {
    [Symbol.iterator](): IterableIterator<T> {
      return iterator;
    },
    next: () => {
      if (index >= array.length) {
        return iterationDone;
      }
      index++;

      return {
        done: false,
        value: array[index - 1],
      };
    },
  };

  return iterator;
};

class FuncIterator<T> implements IterableIterator<T> {
  private readonly iterable: IterableIterator<T>;
  constructor(iterable: IterableIterator<T> | ArrayLike<T>) {
    if ('next' in iterable) {
      this.iterable = iterable;
    } else {
      this.iterable = arrayIterator(iterable);
    }
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this.iterable;
  }

  filter(predicate: (element: T, index: number) => boolean): FuncIterator<T> {
    const filterIterator: IterableIterator<T> = {
      [Symbol.iterator](): IterableIterator<T> {
        return filterIterator;
      },
      next: () => {
        let index = 0;
        for (const value of this) {
          if (predicate(value, index++)) {
            return {
              done: false,
              value: value,
            };
          }
        }
        return iterationDone;
      },
    };
    return new FuncIterator<T>(filterIterator);
  }

  map<V>(callback: (element: T, index: number) => V): FuncIterator<V> {
    let index = 0;
    const mapIterator: IterableIterator<V> = {
      [Symbol.iterator](): IterableIterator<V> {
        return mapIterator;
      },
      next: () => {
        const next = this.iterable.next();
        if (next.done) return iterationDone;

        return {
          value: callback(next.value, index++),
          done: false,
        };
      },
    };
    return new FuncIterator<V>(mapIterator);
  }

  reduce(callback: (previousValue: T, currentValue: T, currentIndex: number) => T, initialValue: T): T;
  reduce(
    callback: (previousValue: T | undefined, currentValue: T, currentIndex: number) => T,
    initialValue?: T,
  ): T | undefined;
  reduce<U>(
    callback: (previousValue: U | undefined, currentValue: T, currentIndex: number) => U,
    initialValue?: U,
  ): U | undefined;
  reduce<U>(callback: (previousValue: U, currentValue: T, currentIndex: number) => U, initialValue: U): U;
  reduce<U>(
    callback: (previousValue: U | undefined, currentValue: T, currentIndex: number) => U,
    initialValue?: U,
  ): U | undefined {
    let index = 0;
    for (const value of this) {
      initialValue = callback(initialValue, value, index++);
    }

    return initialValue;
  }

  next(): IteratorResult<T, undefined> {
    return this.iterable.next();
  }

  toArray(): T[] {
    const result = [];
    for (const value of this) {
      result.push(value);
    }

    return result;
  }

  join(separator = ','): string {
    return this.toArray().join(separator);
  }

  length(): number {
    let length = 0;
    while (!this.next().done) {
      length++;
    }
    return length;
  }
}

const funcIterator = <T>(iterable: IterableIterator<T> | ArrayLike<T>): FuncIterator<T> => {
  return new FuncIterator(iterable);
};

function productAny(arrays: ArrayLike<unknown>[]): FuncIterator<ArrayLike<unknown>> {
  if (!arrays.some((array) => array.length > 0)) {
    return funcIterator([]);
  }

  // pointer to next value for each array
  let indexes = Array<number>(arrays.length).fill(0);
  let done = false;

  const iterator: IterableIterator<ArrayLike<unknown>> = {
    [Symbol.iterator](): IterableIterator<ArrayLike<unknown>> {
      return iterator;
    },
    next: () => {
      if (done) return iterationDone;

      const value = arrays.map((array, arrayIdx) => array[indexes[arrayIdx]]);
      let isIncremented = true;
      indexes = indexes.map((index, arrayIdx) => {
        // index already incremented, return rest unchanged
        if (!isIncremented) return index;

        // check if next index is out of bounds
        if (index + 1 >= arrays[arrayIdx].length) {
          return 0;
        }
        isIncremented = false;
        return index + 1;
      });
      done = isIncremented;

      return {
        done: false,
        value,
      };
    },
  };

  return funcIterator(iterator);
}

export const product2 = <T0, T1>(array0: ArrayLike<T0>, array1: ArrayLike<T1>): FuncIterator<[T0, T1]> => {
  return productAny([array0, array1]) as FuncIterator<[T0, T1]>;
};

export const product = product2;

export const product3 = <T0, T1, T2>(
  array0: ArrayLike<T0>,
  array1: ArrayLike<T1>,
  array2: ArrayLike<T2>,
): FuncIterator<[T0, T1, T2]> => {
  return productAny([array0, array1, array2]) as FuncIterator<[T0, T1, T2]>;
};

export const product4 = <T0, T1, T2, T3>(
  array0: ArrayLike<T0>,
  array1: ArrayLike<T1>,
  array2: ArrayLike<T2>,
  array3: ArrayLike<T3>,
): FuncIterator<[T0, T1, T2, T3]> => {
  return productAny([array0, array1, array2, array3]) as FuncIterator<[T0, T1, T2, T3]>;
};

export default funcIterator;
