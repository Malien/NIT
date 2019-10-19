import React, { useEffect, useState } from "react"
import ResizeObserver from "resize-observer-polyfill"

// const ResizeObserver = ((window as any).ResizeObserver || Pollyfil) as Pollyfil

export interface Bounds {
    width: number;
    height: number;
}

export function useKeyDown(listener: (this: Document, event: KeyboardEvent) => void, deps: any[] = []) {
    useEffect(() => {
        document.addEventListener("keydown", listener)
        return () => {document.removeEventListener("keydown", listener)}
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
export function useBounds<T extends HTMLElement>(ref: React.RefObject<T>): Bounds | undefined;

export function useBounds<T extends HTMLElement>(ref: React.RefObject<T>, defaultVal?: Bounds) {
    let [bounds, setBounds] = useState(defaultVal)
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