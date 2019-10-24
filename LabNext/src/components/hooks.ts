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
    }, [ref])
    useResize(ref, bounds => setBounds(bounds))
    return bounds
}

export function useHover<T extends HTMLElement>(ref: React.RefObject<T>) {
    let [hovered, setHovered] = useState(false)
    useEffect(() => {
        let el = ref.current
        let enter = () => setHovered(true)
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
    let prevScroll: number = (window) ? window.pageYOffset : 0
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
    let [bounds, setBounds] = useState<OptionalBounds>({})
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