import React, { useEffect, useState } from "react"

export interface Bounds {
    width: number;
    height: number;
}

export function useResize<T extends HTMLElement>(ref: React.RefObject<T>, cb: (bounds: Bounds, element: T) => void) {
    useEffect(() => {
        let el = ref.current
        const listener = () => {
            if (el) cb({width: el.clientWidth, height: el.clientHeight}, el)
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
        if (el) setBounds({width: el.clientWidth, height: el.clientHeight})
    }, [ref])
    useResize(ref, bounds => setBounds(bounds))
    return bounds
}
