import React, { FunctionComponent, Children, useState, useEffect, useRef, useMemo } from "react"
import { useBounds } from "./hooks"

export function useKeyDown(listener: (this: Document, event: KeyboardEvent) => void) {
    useEffect(() => {
        document.addEventListener("keydown", listener)
        return () => { document.removeEventListener("keydown", listener) }
    })
}

export const List: FunctionComponent = props => {
    let liNodes = Children.map(props.children, (node) => <li className="layout-list-item">{node}<div className="layout-list-divider" /></li>)
    return (
        <ul className="layout-list">
            {liNodes}
        </ul>
    )
}
List.displayName = "List"

export const ThumbList: FunctionComponent = ({ children }) => {
    let liNodes = Children.map(children, node => <>{node}<div className="layout-tlist-divider" /></>)
    return (
        <div className="layout-tlist">
            <div className="layout-tlist-divider" />
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

interface StackedProps {
    className?: string;
}

export const VSpaced: FunctionComponent<StackedProps> = props => {
    let elRef = useRef<HTMLDivElement>(null)
    let { height } = useBounds(elRef, { width: 0, height: 0 })

    return <>
        <style jsx>{`
            .spacer {
                margin-top: ${height}px;
            }
        `}</style>
        <div className="spacer" />
        <div className={props.className} ref={elRef}>{props.children}</div>
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
    console.log(columns, width, props.columnWidth, width / props.columnWidth)

    let transformed = useMemo(() => {
        return React.Children.map(props.children, (node: React.ReactElement<GridCellProps>, index) => {
            let h = Math.min(node.props.height, columns)
            let w = Math.min(node.props.width, columns)
            if (props.responsive && columns == 1) h *= 1.5; 
            return <div key={index} style={
                {
                    gridRow: `span ${h}`, 
                    gridColumn: `span ${w}`,
                    height: props.rowHeight * h
                }
            }>
                {node}
            </div>
        })}, [columns, props.children]
    )

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