// Guess I'll be writing pollyfill for Object.fromEntries
export function fromEntries<T = any>(entries: [PropertyKey, T][]): { [k in PropertyKey]: T } {
    let out = {}
    entries.forEach(([key, value]) => {
        out[key] = value
    })
    return out
}