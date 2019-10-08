import React, { useEffect, useState } from "react"

export interface Bounds {
    width: number;
    height: number;
}

export function useResize<T extends HTMLElement>(ref: React.RefObject<T>, cb: (bounds: Bounds, element: T) => void) {
    useEffect(() => {
        let el = ref.current
        const listener = () => {
            if (el) cb({width: el.offsetWidth, height: el.offsetHeight}, el)
        }
        if (el) el.addEventListener("resize", listener)
        return () => {
            if (el) el.removeEventListener("resize", listener)
        }
    }, [ref])
}

export function useBounds<T extends HTMLElement>(ref: React.RefObject<T>, defaultVal: Bounds): Bounds;
export function useBounds<T extends HTMLElement>(ref: React.RefObject<T>): Bounds | undefined;

export function useBounds<T extends HTMLElement>(ref: React.RefObject<T>, defaultVal?: Bounds) {
    let [bounds, setBounds] = useState<Bounds | undefined>(defaultVal)
    useEffect(() => {
        let el = ref.current
        if (el) setBounds({width: el.offsetWidth, height: el.offsetHeight})
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