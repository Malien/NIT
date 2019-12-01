import React, { Children, FunctionComponent, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { ExtendableMat } from "../util/structures"
import { useBounds, useKeyDown, useMounted, useWindowBounds } from "./hooks"
import { LookContext, ThemeContext } from "./style"
import { classes } from "./util"

interface ThumbListProps {
    columns: number;
    thumbSize: number | string;
    notop?: boolean;
}

/**
 * Aligned list with space dedicated to thumnail of and item
 * @param param0 columns in a list, size of thumbnail column and whether top divider should be included.
 */
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

/**
 * Component that came here, just because I migrated this file from another project of mine
 * @param props Wheather or not should display children
 */
export const LoadingArea: React.FunctionComponent<LoadingAreaProps> = props => <>{props.loaded ? props.children : <div className="layout-loading" />}</>
LoadingArea.displayName = "LoadingArea"

interface DropdownProps {
    title?: string;
}

/**
 * Dropdown components that came here, just because I migrated this file from another project of mine
 * @param props title of dropdown
 */
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
/**
 * Creates a dynamically sized div with top margin coresponging to encapsulated elements height
 * @param props additional styles for the element to be spaced
 */
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

interface HSpacedProps {
    style: React.CSSProperties;
}
/**
 * Creates a dynamically sized div with right margin coresponging to encapsulated elements width
 * @param props additional styles for the element to be spaced
 */
export const HSpaced: FunctionComponent<HSpacedProps> = props => {
    let elRef = useRef<HTMLDivElement>(null)
    let { width } = useBounds(elRef, { width: 0, height: 0 })

    return <>
        <style jsx>{`
            .spacer {
                margin-left: ${width}px;
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
/**
 * Cell for Adaptive grid with few props to determine it's width and height
 * @param props width and height of a cell (in grid columns, rows span)
 */
export const GridCell: React.FC<GridCellProps> = props => <>{props.children}</>

interface AdaptiveGridProps {
    columnWidth: number;
    rowHeight: number;
    children: React.ReactElement<GridCellProps>[];
    responsive?: boolean;
    placeholder?: JSX.Element;
}
/**
 * Adaptive grid that dynamicaly positions elements to fit all possible gaps that could occur
 * Responsible for that marvelous grid degin of front page
 * @param columnWidth width of a grid column, 
 * @param rowHeight height of a grid row, 
 * @param placeholder placeholder for when screen size is being determined, and positioning is not yet calculated 
 * @param responsive whether or not 
 * @children can only be those who have width and height as their props
 */
export const AdaptiveGrid: React.FC<AdaptiveGridProps> = props => {
    let gridRef = useRef<HTMLDivElement>(null)
    let { width } = useBounds(gridRef, { height: 0, width: 0 })
    let mounted = useMounted()
    let columns = Math.max(Math.floor(width / props.columnWidth), 1)

    let transformed = useMemo(() => {
        let placemap = new ExtendableMat(columns, false)

        if (!mounted) {
            if (props.placeholder) {
                let items: JSX.Element[] = []
                for (let i = 0; i < Children.count(props.children); ++i) {
                    items.push(<div key={i} style={
                        {
                            gridRow: `span 1`,
                            gridColumn: `span 1`,
                            height: props.rowHeight
                        }
                    }>{props.placeholder}</div>)
                }
                return items
            } else return []
        }
        return React.Children.map(props.children, (node: React.ReactElement<GridCellProps>, index) => {
            let h = Math.min(node.props.height, columns)
            let w = Math.min(node.props.width, columns)
            if (props.responsive && columns == 1) h *= 1.5;

            return {
                element: <div key={node.key || index} style={
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
    }, [columns, props.children, mounted])

    let rows = Math.ceil(transformed.length / columns)
    let cellHeight = (props.responsive && columns == 1) ? props.rowHeight * 1.5 : props.rowHeight
    return <>
        <style jsx>{`
            .grid {
                width: 100%;
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(${props.columnWidth}px, 1fr));
                grid-template-rows: repeat(${rows}, ${cellHeight}px);
            }
        `}</style>
        <div className="grid" ref={gridRef}>
            {transformed}
        </div>
    </>
}


interface NoSSRProps {
    fallback?: JSX.Element
}
/**
 * Disables server-side rendering for components inside. Can render optional fallback
 * @param param0 fallback to be rendered
 */
export const NoSSR: React.FC<NoSSRProps> = ({ children, fallback = null }) => {
    let mounted = useMounted()
    return <>{mounted ? children : fallback}</>
}

interface TabProps {
    title: string;
    key?: any;
}
export const Tab: React.FC<TabProps> = props => <>{props.children}</>

interface TabsViewProps {
    defaultTab?: number
    children: React.ReactElement<TabProps>[];
}
export const TabsView: React.FC<TabsViewProps> = props => {
    let theme = useContext(ThemeContext)
    let look = useContext(LookContext)
    let topRef = useRef<HTMLDivElement>(null)
    let selectorRef = useRef<HTMLDivElement>(null)
    let [current, setCurrent] = useState(props.defaultTab || 0)
    let [selectorPosition, setSelectorPosition] = useState({ length: 400, x: 0 })
    let scale = selectorPosition.length
    let {width: windowWidth} = useWindowBounds([])
    useLayoutEffect(() => {
        let top = topRef.current
        let selector = selectorRef.current
        if (top && selector) {
            let cur = top.children[current] as HTMLAnchorElement
            let x = cur.offsetLeft - top.offsetLeft + cur.offsetWidth * 0.1
            let length = cur.offsetWidth * 0.8
            setSelectorPosition({ x, length })
        }
    }, [current, props.children, windowWidth])

    let views = Children.toArray(props.children) as React.ReactElement<TabProps>[]

    return <>
        <style jsx>{`
            .container {
                width: 100%;
                position: relative;
                border-radius: 5px;
            }
            .top {
                font-size: ${look.mediumSize}px;
                display: flex;
                position: relative;
                background-color: ${theme.subbackgroundColor};
                padding: 10px 0;
                border-radius: 20px;
            }
            .tab-title {
                font-family: ${look.font};
                color: ${theme.textColor};
                width: 100%;
                height: 100%;
                height: 1.5em;
                display: flex;
                justify-content: center;
                align-items: center;
                user-select: none;
                cursor: pointer;
                transition: background 0.2s 0s ease-in;
                padding-bottom: 16px;
                margin: 0 10px;
                border-radius: 15px;
            }
            .selector {
                width: 1px;
                height: 6px;
                background-color: ${theme.alternateTextColor};
                position: absolute;
                bottom: 20px;
                left: 0;
                border-radius: 3px;
                transition: all 0.2s 0s ease-in;
            }
            .view {
                margin-top: 20px;
                border-radius: 20px;
                background-color: ${theme.subbackgroundColor};
                width: 100%;
                position: relative;
            }
            .tab-title.selected {
                color: ${theme.alternateTextColor};
                background-color: ${theme.headerSubcolor};
            }
        `}</style>
        <div className="container">
            <div className="top" ref={topRef}>
                {views.map((node, index) =>
                    <a
                        key={node.props.key || index}
                        className={classes({"tab-title": true, "first": index == 0, "selected": index == current})}
                        onClick={() => setCurrent(index)}
                    >{node.props.title}</a>)}
                <div
                    className="selector"
                    ref={selectorRef}
                    // style={{transform: `translateX(${translation}px) scaleX(${scale})`}}
                    style={{ width: scale, left: selectorPosition.x }}
                />
            </div>
            <div className="view">
                {views[current]}
            </div>
        </div>
    </>
}