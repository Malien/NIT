function basicElement(name, props, children) {
    var el = Object.assign(document.createElement(name), props)
    if (children) {
        if (typeof children === "string") el.append(children)
        else children.forEach(function(child) {
            if (child) el.append(child)
        })
    }
    return el
}

function span(props, children) {
    return basicElement("span", props, children)
}

function div(props, children) {
    return basicElement("div", props, children)
}

function img(props) {
    return basicElement("img", props)
}

function a(props) {
    return basicElement("a", props)
}

function button(props, children) {
    return basicElement("button", props, children)
}

function input(props) {
    return basicElement("input", props)
}

function GridItem(item, onBuy) {
    var desc = (item.description.length > 150) ? (item.description.slice(0, 140) + "...") : ""
    return div({className: "grid-item"}, [
        img({className: "item-image", src: item.previews[0], alt: "Item image"}),
        span({className: "text-bold"}, [
            a({href: "/"}, "Item name"),
            item.name
        ]),
        span({className: "text-thin"}, desc),
        div({className: "item-price"}, [
            div({className: "prices"}, [
                item.prevPrice && span({className: "old-price"}, "$" + item.prevPrice),
                span({className: "price"}, "$" + item.price),
            ]),
            button({className: "item-button", onclick: onBuy}, "Buy")
        ])
    ])
}

function toCountNumber(str) {
    var num = 0
    for (var i=0; i<str.length; ++i) {
        var char = str.charAt(i)
        var digit = Number.parseInt(char)
        if (!Number.isNaN(digit))
        num = num*10 + digit
    }
    return num
}

function CartItem(item, onChnage, onSubmit) {
    function submit(event) {
        var count = toCountNumber(event.target.value)
        event.target.value = count
        if (onSubmit) onSubmit(count)
    }
    return [
        img({className: "cart-item-image", src: item.previews[0], alt: item.name + " image"}),
        span({className: "cart-item-name"}, item.name),
        input({
            className: "cart-item-input", 
            type: "number", 
            min: 0, 
            value: item.count, 
            oninput: (function(event) {
                var count = toCountNumber(event.target.value)
                console.log(event.target.value, count)
                event.target.value = count
                if (onChnage) onChnage(count)
            }),
            onblur: submit
        }),
        button({className: "cart-item-button", onclick: submit}, [
            div({className: "cart-item-arrow cart-left"}),
            div({className: "cart-item-arrow cart-right"})
        ])
    ]
}

function populateGrid(container, items) {
    items.map(function(item) {
        return GridItem(item, function() {
            if (globalItemDispatch) globalItemDispatch({
                type: "add",
                item: item
            })
        })
    }).forEach(function(el) {
        container.append(el)
    })
}

function reducer(stateContainer, stateSetter, reducerFunc, container) {
    return function(action) {
        stateSetter(reducerFunc(stateContainer.current, action, container))
    }
}

var globalItemDispatch

function cartItemReducer(oldState, action, container) {
    var state = Object.assign({}, oldState)
    var lookuptable = state.lookuptable
    var pos = lookuptable[action.item.id]
    switch (action.type) {
        case "add":
            if (typeof pos !== "undefined") {
                state.items[pos].count += 1
                var input = container.getElementsByTagName("input")[pos]
                var val = input.value
                input.value = Number.parseInt(val) + 1
            } else {
                lookuptable[action.item.id] = state.items.length
                var newItem = Object.assign({}, action.item, {count : 1})
                state.items.push(newItem)
                CartItem(newItem, function(count) {
                    if (globalItemDispatch) globalItemDispatch({
                        type: "change",
                        item: action.item,
                        count: count
                    })
                }, function(count) {
                    if (globalItemDispatch && count == 0) {
                        globalItemDispatch({
                            type: "remove",
                            item: action.item,
                        })
                    }
                }).forEach(function(el) {container.append(el)})
            }
            break;
        case "change":
            if (typeof pos !== "undefined") {
                state.items[pos].count = action.count
                container.getElementsByTagName("input")[pos].value = action.count
            }
            break;
        case "remove":
            if (typeof pos !== "undefined") {
                for (var i=0; i < 4; ++i) {
                    container.removeChild(container.children[pos*4])
                }
                Object.keys(lookuptable).forEach(function (key) {
                    if (lookuptable[key] == pos) delete lookuptable[key]
                    else if (lookuptable[key] > pos) lookuptable[key] -= 1;
                })
                state.items = state.items.filter(function(i) {
                    return action.item.id != i.id
                })
            }
    }
    return state
}

window.onload = function() {
    var hatsGrid = document.getElementById("hats-grid")
    var legginsGrid = document.getElementById("leggins-grid")
    var topsGrid = document.getElementById("tops-grid")
    
    var cart = document.getElementById("cart")
    var cartNoitems = document.getElementById("cart-noitems")
    var cartList = document.getElementById("cart-list")
    var cartTotal = document.getElementById("cart-total")
    var cartButton = document.getElementById("cart-button")
    var cartColumn = document.getElementById("cart-column")
    var cartDimmer = document.getElementById("cart-dimmer")

    var stateContainer = {
        current: {
            shown: false,
            surfaced: false,
            items: [],
            lookuptable: {}
        }
    }
    
    function setCartState(state) {
        if (state == stateContainer.current) return
        if (state.shown) {
            cart.classList.remove("hidden")
            cartColumn.classList.remove("hidden")
            cartDimmer.classList.remove("hidden")
        } else {
            cartDimmer.classList.add("hidden")
            cart.classList.add("hidden")
            cartColumn.classList.add("hidden")
        }
        if (state.surfaced) {
            cart.classList.add("surfaced")
        } else {
            cart.classList.remove("surfaced")
        }
        if (state.items.length == 0) {
            cartNoitems.classList.remove("hidden")
            cartTotal.classList.add("hidden")
            cartButton.classList.add("hidden")
            if (!state.shown) cart.classList.remove("surfaced")
        } else {
            cart.classList.add("surfaced")
            cartButton.classList.remove("hidden")
            cartNoitems.classList.add("hidden")
            cartTotal.classList.remove("hidden")
            var sum = state.items.reduce(function(acc, curr) {
                return acc + curr.count * curr.price
            }, 0)
            if (sum == 0) {
                cartTotal.classList.add("disabled")
                cartButton.disabled = true
            }
            else {
                cartButton.disabled = false
                cartTotal.classList.remove("disabled")
            }
            cartTotal.innerText = "Total: $" + sum.toFixed(2)
        }
        stateContainer.current = state
    }

    setCartState(Object.assign({}, stateContainer.current))

    cart.addEventListener("click", function() {
        if (!stateContainer.current.shown) setCartState(Object.assign({}, stateContainer.current, {shown: true}))
    })
    cartDimmer.addEventListener("click", function() {
        if (stateContainer.current.shown) setCartState(Object.assign({}, stateContainer.current, {shown: false}))
    })
    window.addEventListener("keydown", function(e) {
        if (e.key === "Escape" && stateContainer.current.shown)
            setCartState(Object.assign({}, stateContainer.current, {shown: false}))
    })

    globalItemDispatch = reducer(stateContainer, setCartState, cartItemReducer, cartList)

    // globalItemDispatch({
    //         type: "add",
    //         item: hats[0]
    //     })
    // globalItemDispatch({
    //         type: "add",
    //         item: hats[0]
    //     })
    // globalItemDispatch({
    //         type: "add",
    //         item: hats[1]
    //     })

    if (hatsGrid) populateGrid(hatsGrid, hats)
    if (legginsGrid) populateGrid(legginsGrid, leggins)
    if (topsGrid) populateGrid(topsGrid, tops)
}