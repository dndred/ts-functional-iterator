const iterationDone: { done: true; value: undefined } = {
  done: true,
  value: undefined,
};

class FuncIterator<T> implements IterableIterator<T> {
  private readonly iterable: IterableIterator<T>;
  constructor(iterable: IterableIterator<T> | readonly T[]) {
    if ('values' in iterable) {
      this.iterable = iterable.values();
    } else {
      this.iterable = iterable;
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
}

export const testFunction = () => 2;

const funcIterator = <T>(iterable: IterableIterator<T> | readonly T[]): FuncIterator<T> => {
  return new FuncIterator(iterable);
};

export default funcIterator;
