import React, { useEffect, useState } from "react"
import ResizeObserver from "resize-observer-polyfill"

export interface Bounds {
    width: number;
    height: number;
}

export function useKeyDown(listener: (this: Document, event: KeyboardEvent) => void, deps: any[] = []) {
    useEffect(() => {
        document.addEventListener("keydown", listener)
        return () => { document.removeEventListener("keydown", listener) }
    }, deps)
}

export function useCancel<T extends HTMLElement>(ref: React.RefObject<T>, cb: () => void, deps: any[] = []) {
    useEffect(() => {
        const mfunc = (event: MouseEvent) => {
            let el = ref.current
            if (el
                && event.target
                && !el.contains(event.target as Node)
            ) cb()
        }
        document.addEventListener("click", mfunc)
        return () => document.removeEventListener("click", mfunc)
    }, [ref, ...deps])

    useKeyDown((event) => {
        if (event.key === "Escape") cb()
    }, deps)
}

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

export function useMounted() {
    let [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    return mounted
}