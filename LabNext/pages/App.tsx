import React, { useRef } from "react"
import { useBounds } from "../src/components/hooks"
// import { TogglableList, TogglableComponentProp } from "../components/layout"

// const SidebarCell: React.FC<TogglableComponentProp> = props => <div style={{width: "100px", height: "50px", backgroundColor: props.selected ? "red" : "gray"}}></div>

const App = props => {
    let cr = useRef<HTMLDivElement>(null)
    let { width, height } = useBounds(cr, {width: -1, height: -1})
    return <div id="h" ref={cr} style={{width: "100%", height: "100%"}}>width: {width}, height: {height}</div>
}
export default App