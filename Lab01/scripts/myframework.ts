interface FNode {
    tag: string;
    props: any;
    children?: FNode[];
}
interface RenderNode{
    dom: Node;
    tag: string;
    props: any;
    children?: RenderNode[];
}
enum DiffType {
    add, remove, change
}
interface DiffNode {
    type: DiffType;
    children?: DiffChildren;
    dom: Node;
}
interface DiffChildren {
    [key: number]: DiffNode;
}

function renderDOM(node: FNode): Node {
    if (node.tag === "_TEXT_") return document.createTextNode(node.props.text)
    return Object.assign(document.createElement(node.tag), node.props)
}

function render(node: FNode): RenderNode {
    if (node.children) return {tag: node.tag, props: node.props, dom: renderDOM(node), children: node.children.map(render)}
    return {tag: node.tag, props: node.props, dom: renderDOM(node)}
}

function renderToDiff(children: RenderNode[]) {
    let out = {}
    children.forEach((node, index) => {
        out[index] = {type: }
    });
}
function diff(oldNode: RenderNode, newNode: FNode): DiffNode[] {
    if (oldNode.tag !== newNode.tag) return [
        {type: DiffType.remove, dom: oldNode.dom}, {type: DiffType.add, dom: renderDOM(newNode), children: newNode.children.map(render)}
    ]
}
function diffList(oldList: RenderNode[], newList: FNode[]): DiffChildren {}


var tree = div({ className: "class" }, [
    "text",
    span({ className: "sp" }, "span"),
    "mutation"
])
var diffTree = div({ className: "class name" }, [
    span({ className: "sp" }, "span"),
    "mutated"
])