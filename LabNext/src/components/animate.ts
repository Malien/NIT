export const linear = (x: number) => x
export const easeInSine = (x: number) => Math.sin(x * Math.PI/2)
export const easeInOutSine = (x: number) => (1 - Math.cos(x * Math.PI)) / 2

/**
 * Scroll element with a linear animation
 * @param el element which to scroll
 * @param x x coord to which scroll
 * @param y y coord to which scroll
 * @param duration duration of animation in milliseconds
 */
export function scrollTo(el: HTMLElement, x: number, y: number, duration: number, func:(x: number) => number = linear) {
    let xStart = el.scrollLeft
    let yStart = el.scrollTop
    let start: number | undefined
    let animation = (timestamp: number) => {
        if (!start) start = timestamp - 1
        let per = func((timestamp - start) / duration)
        if (per <= 0.98) {
            el.scrollTo(xStart + (x - xStart)*per, yStart + (y-yStart)*per)
            requestAnimationFrame(animation)
        } else el.scrollTo(x, y)
    }
    requestAnimationFrame(animation)
}