import React, { useContext, useEffect, useLayoutEffect, useState } from "react"
import ResizeObserver from "resize-observer-polyfill"
import { AuthContext } from "./auth"
import { Dark, Light } from "./style"

export interface Bounds {
    width: number;
    height: number;
}

/**
 * calls callback when key is pressed
 * @param listener responds to keyboard event
 * @param deps optional React dependancies @see https://reactjs.org/docs/hooks-effect.html
 */
export function useKeyDown(listener: (this: Document, event: KeyboardEvent) => void, deps: any[] = []) {
    useEffect(() => {
        document.addEventListener("keydown", listener)
        return () => { document.removeEventListener("keydown", listener) }
    }, deps)
}

/**
 * 
 * @param ref reference to an element that should dismiss current *thing*
 * @param cb callback that is called upon cancelling
 * @param deps optional React dependancies @see https://reactjs.org/docs/hooks-effect.html
 */
export function useCancel<T extends HTMLElement>(ref: React.RefObject<T>, cb: () => void, deps?: any[]) {
    useEffect(() => {
        const mfunc = () => {
            cb()
        }
        let el = ref.current
        if (el) el.addEventListener("click", mfunc)
        return () => {
            if (el) el.removeEventListener("click", mfunc)
        }
    }, deps ? [ref, ...deps] : undefined)

    useKeyDown((event) => {
        if (event.key === "Escape") cb()
    }, deps ? [...deps] : undefined)
}

/**
 * Setups listener to an element resize
 * @param ref React reference to an object to be measured
 * @param cb callback that is called upon element resize
 */
export function useResize<T extends HTMLElement>(ref: React.RefObject<T> | T, cb: (bounds: Bounds, element: T) => void) {
    useEffect(() => {
        let el: T | null
        if (ref instanceof HTMLElement) {
            el = ref
        } else {
            el = ref.current
        }
        let ro = new ResizeObserver(entries => {
            let el = entries[0].target as T
            cb({ width: el.offsetWidth, height: el.offsetHeight }, el)
        })
        if (el) ro.observe(el)
        return () => {
            if (el) ro.unobserve(el)
        }
    }, [ref])
}

export function useBounds<T extends HTMLElement>(ref: React.RefObject<T>, defaultVal: Bounds): Bounds;
export function useBounds<T extends HTMLElement>(ref: React.RefObject<T>): OptionalBounds;

/**
 * Returns dyncamic element bounds. If no defaultValue is provided, bounds can contain undefined width and height
 * @param ref React reference to an object to be measured
 * @param defaultVal default value of bounds to be used without null-checks
 */
export function useBounds<T extends HTMLElement>(ref: React.RefObject<T>, defaultVal?: Bounds) {
    let [bounds, setBounds] = useState<Bounds | OptionalBounds>(defaultVal || {})
    useEffect(() => {
        let el = ref.current
        if (el) setBounds({ width: el.offsetWidth, height: el.offsetHeight })

        setTimeout(() => {
            if (el) setBounds({ width: el.offsetWidth, height: el.offsetHeight })
        }, 1000);

        // function observe() {
        //     if (el) {
        //         if (el.offsetWidth != bounds.width || el.offsetHeight != bounds.height)
        //             setBounds({ width: el.offsetWidth, height: el.offsetHeight })
        //     }
        // }
        // window.addEventListener("resize", observe)

        // return () => window.removeEventListener("resize", observe)
    }, [ref])
    useResize(ref, bounds => setBounds(bounds))
    return bounds
}

export function useBoundsThrottled<T extends HTMLElement>(ref: React.RefObject<T>, throtlepx: number, defaultVal: Bounds): Bounds;
export function useBoundsThrottled<T extends HTMLElement>(ref: React.RefObject<T>, throtlepx: number): OptionalBounds;

/**
 * Same as useBounds, but updates only when resizing of an element became bigger than throttlepx
 * @param ref React reference to an object to be measured
 * @param throtlepx amount of size change pixels ignored until update is called
 * @param defaultVal default value of bounds to be used without null-checks
 */
export function useBoundsThrottled<T extends HTMLElement>(ref: React.RefObject<T>, throtlepx: number, defaultVal?: Bounds): OptionalBounds | Bounds {
    let [bounds, setBounds] = useState<Bounds | OptionalBounds>(defaultVal || {})
    useEffect(() => {
        let el = ref.current
        if (el) setBounds({ width: el.offsetWidth, height: el.offsetHeight })

        // function observe() {
        //     if (el) {
        //         if (bounds.width && bounds.height) {
        //             if (Math.abs(el.offsetWidth - bounds.width) > throtlepx || Math.abs(el.offsetHeight - bounds.height) > throtlepx)
        //                 setBounds({ width: el.offsetWidth, height: el.offsetHeight })
        //         }
        //     }
        // }
        // window.addEventListener("resize", observe)

        // return () => window.removeEventListener("resize", observe)
    }, [ref])

    useResize(ref, ({ height, width }) => {
        let el = ref.current
        if (el) {
            let elH = el.offsetHeight
            let elW = el.offsetWidth
            if (Math.abs(elW - width) > throtlepx || Math.abs(elH - height) > throtlepx) {
                setBounds({ width: elW, height: elH })
            }
        }
    })
    return bounds
}

/**
 * Returns whether or not pointer is inside the element
 * @param ref element or reference to it to be observer
 * @param onEnter optional callback to be called upon pointer entering element
 */
export function useHover<T extends HTMLElement>(ref: React.RefObject<T> | T | undefined, onEnter?: () => void) {
    let [hovered, setHovered] = useState(false)
    useEffect(() => {
        if (ref) {
            let el = (ref instanceof HTMLElement) ? ref : ref.current
            let enter = onEnter
                ? () => {
                    onEnter()
                    setHovered(true)
                }
                : () => setHovered(true)
            let leave = () => setHovered(false)
            if (el) {
                el.addEventListener("mouseenter", enter)
                el.addEventListener("mouseleave", leave)
            }
            return () => {
                if (el) {
                    el.removeEventListener("mouseenter", enter)
                    el.removeEventListener("mouseleave", leave)
                }
            }
        }
    }, [ref])
    return hovered
}

/**
 * Attaches click event listener to an element
 * @param ref React reference to an object to be acted upon
 * @param cb click event callback
 * @param deps optional React dependancies @see https://reactjs.org/docs/hooks-effect.html
 */
export function useClick<T extends HTMLElement>(ref: React.RefObject<T>, cb: (event: MouseEvent) => void, deps: any[] = []) {
    useEffect(() => {
        let obj = ref.current
        if (obj) {
            obj.addEventListener("click", cb)
            return () => { if (obj) obj.removeEventListener("click", cb) }
        }
    }, [ref, ...deps])
}

const dscrollTrigger = 20
/**
 * Returns a boolean that tells whether element is suitable to be shown on mobile. 
 * Elemet is thought to revealed when user scrolls up, or reached offset from the top.
 * Element is thought to hide when user scrolls down fast enough.
 * @param initial whether element is initally suitable for mobile displayment. @default true
 * @param offsetShown offset from top of the screen where element is shown no matter the scroll @default 0
 */
export function useMobileScroll(initial: boolean = true, offsetShown: number = 0) {
    let [shown, setShown] = useState(initial)
    let prevScroll = 0
    if (typeof window !== "undefined") {
        prevScroll = window.pageYOffset
    }
    useEffect(() => {
        const f = () => {
            let dscroll = window.pageYOffset - prevScroll
            prevScroll = window.pageYOffset
            if ((dscroll < -dscrollTrigger && !shown) || window.pageYOffset < offsetShown) setShown(true)
            else if (dscroll > dscrollTrigger && shown) setShown(false)
        }
        document.addEventListener("scroll", f)
        return () => document.removeEventListener("scroll", f)
    }, [shown])
    return shown
}

interface OptionalBounds {
    width?: number;
    height?: number
}
/**
 * Get window sizes, and upade upon resize
 * @param deps optional React dependancies @see https://reactjs.org/docs/hooks-effect.html
 * @returns window bounds
 */
export function useWindowBounds(deps: any[] = []) {
    let initial = (typeof window !== "undefined") ? { width: window.innerWidth, height: window.innerHeight } : {}
    let [bounds, setBounds] = useState<OptionalBounds>(initial)
    useEffect(() => {
        setBounds({ width: window.innerWidth, height: window.innerHeight })
        const f = () => {
            setBounds({ width: window.innerWidth, height: window.innerHeight })
        }
        window.addEventListener("resize", f)
        return () => window.removeEventListener("resize", f)
    }, [...deps])
    return bounds
}

/**
 * @returns true if component is mounted to the DOM
 */
export function useMounted() {
    let [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    return mounted
}

interface PartialInputState {
    value: string;
}
interface ValidatedInputState extends PartialInputState {
    valid: boolean;
}
type InputState = PartialInputState | ValidatedInputState
/**
 * Setups state for an input field. With validation
 * @param params value: initial value of a field, pattern: pattern to validate the input
 * @returns object with current value, and field validity
 */
export function useInputState(params: { value?: string, pattern: RegExp | string }): [ValidatedInputState, (value: string) => void]
/**
 * Setups state for an input field. Without validation
 * @param params value: initial value of a field
 * @returns object with current value
 */
export function useInputState(params: { value?: string }): [PartialInputState, (value: string) => void]

export function useInputState({ value, pattern }: { value?: string, pattern?: RegExp | string }): [InputState, (value: string) => void] {
    let defaultState = (pattern) ? { value: value || "", valid: true } : { value: value || "" }
    let [state, setState] = useState<InputState>(defaultState)
    if (pattern) {
        let p = (typeof pattern == "string") ? new RegExp(pattern) : pattern
        return [state, (value: string) => {
            setState({ value, valid: p.test(value) })
        }]
    }
    return [state, (value: string) => { setState({ value }) }]
}

export function useTheme() {
    let [theme, setTheme] = useState(Light)
    useLayoutEffect(() => {
        let match = window.matchMedia("(prefers-color-scheme: dark)").matches
        setTheme(match ? Dark : Light)

        function match_func({ matches }: MediaQueryListEvent) {
            if (matches) setTheme(Dark)
            else setTheme(Light)
        }
        window.matchMedia("(prefers-color-scheme: dark)").addListener(match_func)
        return () => window.matchMedia("(prefers-color-scheme: dark)").removeListener(match_func)
    }, [])
    return theme
}

export interface ReturnedDataWrapper<T> {
    data?: T;
    err?: any;
    loading: boolean;
}
export function useData<T = any>(url, { body, method }: { body?: BodyInit | null; method?: string; } = {}, deps?: any[]): ReturnedDataWrapper<T> {
    let [data, setData] = useState<T | undefined>()
    let [err, setErr] = useState<any | undefined>()
    let [loading, setLoading] = useState(true)
    let auth = useContext(AuthContext)
    useEffect(() => {
        if (auth && auth.token.accessToken) {
            fetch(url, {
                method,
                body,
                headers: {
                    "Authorization": `Bearer ${auth.token.accessToken}`
                }
            })
            .then(v => v.json())
            .then(setData)
            .catch(err => {
                console.error(err)
                setErr(err)
            })
            .then(() => setLoading(false))
        } else {
            fetch(url, { body, method }).then(v => v.json()).then(setData).catch(setErr).then(() => setLoading(false))
        }
    }, deps)
    return { data, err, loading }
}