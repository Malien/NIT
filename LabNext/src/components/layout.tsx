import React, { FunctionComponent, Children, useState, useEffect, useRef, useMemo, useContext } from "react"
import { useBounds, useKeyDown, useCancel } from "./hooks"
import { ExtendableMat } from "../util/structures"
import { ThemeContext } from "./style"

interface ThumbListProps {
    columns: number;
    thumbSize: number | string;
    notop?: boolean;
}

export const ThumbList: FunctionComponent<ThumbListProps> = ({ children, columns, thumbSize, notop }) => {
    let theme = useContext(ThemeContext)
    let divider = <div style={{
        width: "95%",
        float: "left",
        height: 1,
        backgroundColor: theme.alternateTextSubcolor,
        gridColumn: ` 2 / span ${columns - 1}`
    }} />

    let liNodes = Children.map(children, node => <>{node}{divider}</>)
    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: `${(typeof thumbSize === "number") ? `${thumbSize}px` : thumbSize} ${
                Array<string>(columns - 1).fill("auto", 0, columns - 1).join(" ")}`
        }}>
            {!notop && divider}
            {liNodes}
        </div>
    )
}
ThumbList.displayName = "ThumbList"

interface LoadingAreaProps {
    loaded: boolean;
}

export const LoadingArea: React.FunctionComponent<LoadingAreaProps> = props => <>{props.loaded ? props.children : <div className="layout-loading" />}</>
LoadingArea.displayName = "LoadingArea"

interface DropdownProps {
    title?: string;
}

export const Dropdown: FunctionComponent<DropdownProps> = props => {
    let [hidden, setHidden] = useState(true)
    let dropdownRef = useRef<HTMLDivElement>(null)
    let buttonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        function documentClick(event: MouseEvent) {
            let dropdown = dropdownRef.current
            let button = buttonRef.current
            if (dropdown
                && button
                && event.target
                && !button.contains(event.target as Node)
                && !dropdown.contains(event.target as Node)
            ) {
                setHidden(true)
            }
        }
        document.addEventListener("click", documentClick)
        return () => {
            document.removeEventListener("click", documentClick)
        }
    }, [])
    useKeyDown((event) => {
        if (event.key == "Escape" && !hidden) setHidden(true)
    })

    return <>
        <div className={"layout-dropdown-dimming" + (hidden ? " layout-dropdown-hidden" : "")} />
        <div className="layout-dropdown-spacer" />
        <div className={"layout-dropdown" + (hidden ? " layout-dropdown-hidden" : "")}>
            <div className={"layout-dropdown-background" + (hidden ? " layout-dropdown-hidden" : "")} />
            <button ref={buttonRef} className="layout-dropdown-top" onClick={() => {
                setHidden(!hidden)
            }}>
                <span className="layout-dropdown-title">{props.title}</span>
                <img className={"layout-dropdown-arrow" + (hidden ? " layout-dropdown-hidden" : "")} src="../../../assets/SVG/dropdown-arrow.svg" />
            </button>
            <div ref={dropdownRef} className={"layout-dropdown-content " + (hidden ? "layout-dropdown-hidden" : "")}>
                {props.children}
            </div>
        </div>
    </>
}
Dropdown.displayName = "Dropdown"

interface VSpacedProps {
    style: React.CSSProperties;
}

export const VSpaced: FunctionComponent<VSpacedProps> = props => {
    let elRef = useRef<HTMLDivElement>(null)
    let { height } = useBounds(elRef, { width: 0, height: 0 })

    return <>
        <style jsx>{`
            .spacer {
                margin-top: ${height}px;
            }
        `}</style>
        <div className="spacer" />
        <div style={{ position: "absolute", ...props.style }} ref={elRef}>{props.children}</div>
    </>
}

interface GridCellProps {
    width: number;
    height: number;
}
export const GridCell: React.FC<GridCellProps> = props => <>{props.children}</>

interface AdaptiveGridProps {
    columnWidth: number;
    rowHeight: number;
    children: React.ReactElement<GridCellProps>[];
    responsive?: boolean;
}
export const AdaptiveGrid: React.FC<AdaptiveGridProps> = props => {
    let gridRef = useRef<HTMLDivElement>(null)
    let { width } = useBounds(gridRef, { height: 0, width: 0 })
    let columns = Math.floor(width / props.columnWidth)

    let transformed = useMemo(() => {
        let placemap = new ExtendableMat(columns, false)

        return React.Children.map(props.children, (node: React.ReactElement<GridCellProps>, index) => {
            let h = Math.min(node.props.height, columns)
            let w = Math.min(node.props.width, columns)
            if (props.responsive && columns == 1) h *= 1.5;

            return {
                element: <div key={index} style={
                    {
                        gridRow: `span ${h}`,
                        gridColumn: `span ${w}`,
                        height: props.rowHeight * h
                    }
                }>
                    {node}
                </div>,
                width: w,
                height: h
            }
        })
            .sort((a, b) => b.height * b.width - a.height * a.width)
            .map(({ element, width, height }) => {
                let y = 0
                while (true) {
                    for (let x = 0; x <= columns - width; ++x) {
                        let free = true
                        check:
                        for (let i = 0; i < height; ++i) {
                            for (let j = 0; j < width; ++j) {
                                if (placemap[y + i][x + j]) {
                                    free = false
                                    break check;
                                }
                            }
                        }
                        if (free) {
                            for (let i = 0; i < height; ++i)
                                for (let j = 0; j < width; ++j)
                                    placemap[y + i][x + j] = true
                            return { element, index: y * columns + x }
                        }
                    }
                    y++
                }
            }).sort((a, b) => a.index - b.index)
            .map(v => v.element)
    }, [columns, props.children])

    return <>
        <style jsx>{`
            .grid {
                width: 100%;
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(${props.columnWidth}px, 1fr));
                grid-template-rows: repeat(auto-fit, ${(props.responsive && columns == 1) ? props.rowHeight * 1.5 : props.rowHeight}px);
            }
        `}</style>
        <div className="grid" ref={gridRef}>
            {transformed}
        </div>
    </>
}