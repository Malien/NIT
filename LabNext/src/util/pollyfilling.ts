/**
 * Guess I'll write pollyfill for Object.fromEntries cause it's so handy
 * @param entries Array of [key, value] pairs
 */
export function fromEntries<T = any>(entries: [PropertyKey, T][]): { [k in PropertyKey]: T } {
    let out = {}
    entries.forEach(([key, value]) => {
        out[key] = value
    })
    return out
}