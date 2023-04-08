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

export function product<T0, T1>(array0: ArrayLike<T0>, array1: ArrayLike<T1>): FuncIterator<[T0, T1]> {
  let index0 = 0;
  let index1 = 0;
  const iterator: IterableIterator<[T0, T1]> = {
    [Symbol.iterator](): IterableIterator<[T0, T1]> {
      return iterator;
    },
    next: () => {
      if (index0 >= array0.length) {
        return iterationDone;
      }
      if (index1 >= array1.length) {
        index0++;
        index1 = 0;
      }
      if (index0 >= array0.length) {
        return iterationDone;
      }
      return {
        done: false,
        value: [array0[index0], array1[index1++]],
      };
    },
  };

  return funcIterator(iterator);
}

export default funcIterator;
