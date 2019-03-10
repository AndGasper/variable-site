



namespace AggregateList {
    interface Iterator<T> {
        first(): void;
        next(): void;
        return?(value?: any): IteratorResult<T>;
        throw?(e?: any): IteratorResult<T>;
        end: boolean;
        item: T;
        index: number;
    }
    interface IteratorResult<T> {
        done: boolean;
        value: T;
    }
    interface Iterable<T> {
        [Symbol.iterator](): Iterator<T>;
    }

    // interface Array<T> {
    //     iterator: ArrayIterator.Iterator<T>;
    // }
    
    // not terribly important right now, but...
    // index = 0 -> can probably be generalized for any "orientable" type
    abstract class IterableIterator<T> implements Iterator<T> {
        index = 0;
        constructor(public array: T[]) {
            const CustomIterator = Object.defineProperty(array, 'iterator', {
                get() {
                    return new Array(this);
                }  
            });
        }
        first(): void {
            this.index = 0;
        }
        next(): void {
            this.index++;
        }
        get end(): boolean {
            return this.index >= this.array.length;
        }
        get item(): T {
            return this.array[this.index];
        }

    }
}