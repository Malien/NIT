const top = 0;
const parent = i => ((i + 1) >>> 1) - 1;
const left = i => (i << 1) + 1;
const right = i => (i + 1) << 1;

type cmp<T> = (a: T, b: T) => boolean

export class PriorityQueue<T> {
    _heap: T[];
    _comparator: cmp<T>;
    constructor(comparator: cmp<T> = (a, b) => a > b) {
        this._heap = [];
        this._comparator = comparator;
    }
    size() {
        return this._heap.length;
    }
    isEmpty() {
        return this.size() == 0;
    }
    peek() {
        return this._heap[top];
    }
    push(...values: T[]) {
        values.forEach(value => {
            this._heap.push(value);
            this._siftUp();
        });
        return this.size();
    }
    pop() {
        const poppedValue = this.peek();
        const bottom = this.size() - 1;
        if (bottom > top) {
            this._swap(top, bottom);
        }
        this._heap.pop();
        this._siftDown();
        return poppedValue;
    }
    replace(value: T) {
        const replacedValue = this.peek();
        this._heap[top] = value;
        this._siftDown();
        return replacedValue;
    }
    _greater(i, j) {
        return this._comparator(this._heap[i], this._heap[j]);
    }
    _swap(i, j) {
        [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
    }
    _siftUp() {
        let node = this.size() - 1;
        while (node > top && this._greater(node, parent(node))) {
            this._swap(node, parent(node));
            node = parent(node);
        }
    }
    _siftDown() {
        let node = top;
        while (
            (left(node) < this.size() && this._greater(left(node), node)) ||
            (right(node) < this.size() && this._greater(right(node), node))
        ) {
            let maxChild = (right(node) < this.size() && this._greater(right(node), left(node))) ? right(node) : left(node);
            this._swap(node, maxChild);
            node = maxChild;
        }
    }
}

export class ExtendableMat<T> {
    arr: T[][] = []
    len: number
    defaultVal: T
    constructor(len: number, defaultVal: T) {
        this.len = len
        this.defaultVal = defaultVal
        return new Proxy(this, {
            get: (target, y: string | number) => {
                if (typeof y === "string") {
                    let n = Number.parseInt(y)
                    if (Number.isNaN(n)) return target[y]
                    else {
                        let diff = n - target.arr.length
                        for (let i = 0; i <= diff; ++i) {
                            this.arr.push(Array<T>(target.len).fill(target.defaultVal, 0, target.len))
                        }
                        return new Proxy(target, {
                            get: (target, x: string) => target.arr[n][Number.parseInt(x)],
                            set: (target, x: string, v: T) => {
                                let ni = Number.parseInt(x)
                                if (ni < target.len) {
                                    target.arr[n][ni] = v
                                    return true
                                } else return false
                            }
                        })
                    }
                } else {
                    for (let i = 0; i <= y - target.arr.length; ++i) {
                        this.arr.push(Array<T>(target.len).fill(target.defaultVal, 0, target.len))
                    }
                    return new Proxy(target, {
                        get: (target, x: number) => target.arr[y][x],
                        set: (target, x: number, v: T) => {
                            if (x < target.len) {
                                target.arr[y][x] = v
                                return true
                            } else return false
                        }
                    })
                }
            },
            set: (target, y: number, v: T[]) => {
                if (v.length == target.len) {
                    target.arr[y] = v
                    return true
                } else return false
            }
        })
    }
}