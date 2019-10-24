import React, { useContext, useState, useEffect, useReducer, useRef } from "react"
import Link from "next/link"
import Head from "next/head"

import { ThemeContext, LookContext, Light, Dark } from "./style";
import { VSpaced, HSpaced, SlideoverPanel } from "./layout";
import { StoreItem } from "../shared/components";
import { Section, SectionProps } from "./section";
import { ShoppingCartContext, ShoppingCart, SCActionType, SHOPPING_CART_VERSION, SCReducer } from "./shopping";
import { useMobileScroll, useWindowBounds, useCancel, useClick, useKeyDown } from "./hooks";

//TODO: provide default image for product
export const defaultImage = "";

interface MobileHeaderProps {
    onHamburger?: () => void;
    title: string;
    animated?: boolean;
}
export const MobileHeader: React.FC<MobileHeaderProps> = props => {
    let shown = useMobileScroll(true, 50)
    let theme = useContext(ThemeContext)
    let look = useContext(LookContext)
    return <>
        <style jsx>{`
            header {
                display: flex;
                z-index: 10;
                width: 100%;
                height: 50px;
                position: fixed;
                top: 0;
                /* left: 0; */
                background-color: ${theme.mobileHeaderColor};
                transition: transform 0.2s 0s ease-in;
                border-bottom: solid 1px ${theme.alternateTextSubcolor};
            }
            header::before {
                content: "";
                position: absolute;
                display: block;
                height: 100%;
                width: 100%;
                box-shadow: ${theme.shadowColor} 0px 3px 10px 3px;
            }
            header.hidden {
                transform: translateY(-50px);
            }
            button {
                appearance: none;
                position: relative;
                border: none;
                background: none;
                padding: 0;
                margin: 5px 10px;
                width: 40px;
                height: 40px;
                display: block;
                padding-right: 10px;
                border-right: solid 2px ${theme.textSubcolor};
            }
            span {
                font-family: ${look.font};
                font-size: ${look.mediumSize}px;
                color: ${theme.textColor};
                line-height: 50px;
            }
            .spacer {
                margin-top: 50px;
            }
            .line {
                width: 100%;
                height: 4px;
                border-radius: 2px;
                background-color: ${theme.textColor};
                margin: 5px 0;
                pointer-events: none;
            }
        `}</style>
        <header className={shown ? "" : "hidden"}>
            <button className={props.animated ? "animated" : ""} onClick={() => {
                console.log("ham")
                if (props.onHamburger) props.onHamburger()
            }}>
                <div className="line" />
                <div className="line" />
                <div className="line" />
            </button>
            <span>{props.title}</span>
        </header>
        <div className="spacer" />
    </>
}

interface NavLinkProps {
    thumb?: JSX.Element;
    label: string;
    href: string;
    selected?: boolean;
}
export const NavLink: React.FC<NavLinkProps> = props => {
    let theme = useContext(ThemeContext)
    let look = useContext(LookContext)
    return <>
        <style jsx>{`
            a {
                text-decoration: none;
                display: contents;
                padding: 10px 20px;
            }
            div {
                grid-column: 1;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            span {
                grid-column: 2;
                color: ${theme.alternateTextColor};
                font-family: ${look.font};
                font-size: ${props.selected ? look.largeSize : look.mediumSize}px;
                font-weight: ${props.selected ? 800 : 400};
            }
        `}</style>
        <Link href={props.href}>
            <a>
                <div>{props.thumb}</div>
                <span>{props.label}</span>
            </a>
        </Link>
    </>
}

interface SidebarProps {
    path?: string;
    hidden?: boolean;
}
export const Sidebar: React.FC<SidebarProps> = props => {
    let theme = useContext(ThemeContext)
    // let circle = <div style={{height: 15, width: 15, backgroundColor: theme.alternateTextColor, borderRadius: "50%"}} />
    let circle = <></>
    return <>
        <style jsx>{`
            .navigation {
                display: grid;
                grid-template-columns: 50px auto;
                margin: 10px;
            }
            header {
                z-index: 20;
                position: fixed;
                width: 250px;
                height: 100vh;
                background-color: ${theme.headerColor};
                box-shadow: ${theme.shadowColor} 5px 0px 8px;
                transition: transform 0.2s 0s ease-in;
            }
            header.hidden {
                transform: translateX(-260px);
            }
            img {
                margin: 5%;
                margin-top: 40px;
            }
            .spacer {
                margin-right: 250px;
            }
        `}</style>
        <header className={props.hidden ? "hidden" : ""}>
            <img src="static/assets/SVG/White-logo.svg" className="logo" alt="Shop logo" />
            <div className="navigation">
                <NavLink selected={props.path == "/"} thumb={circle} label="All Items" href="/" />
                <NavLink selected={props.path == "/accessories"} thumb={circle} label="Hats" href="/accessories" />
                <NavLink selected={props.path == "/tops"} thumb={circle} label="Tops" href="/tops" />
                <NavLink selected={props.path == "/leggins"} thumb={circle} label="Leggins" href="/leggins" />
            </div>
        </header>
    </>
}

export const Footer: React.FC = props => {
    let theme = useContext(ThemeContext)
    let look = useContext(LookContext)
    return <>
        <style jsx>{`
            footer {
                width: 100%;
                background-color: ${theme.footerColor};
                position: relative;
                bottom: 0;
                display: flex;
                align-items: center;
                font-size: ${look.smallSize}px;
            }
            .logo {
                margin: 20px;
                margin-top: 40px;
                height: 100px;
            }
            .text-thin {
                color: ${theme.alternateTextSubcolor};
                font-family: ${look.font};
                font-weight: 300;
            }
            .text-bold {
                color: ${theme.alternateTextColor};
                font-family: ${look.font};
                font-weight: 650;
            }
            a {
                text-decoration: none;
            }
            .copyright {
                color: ${theme.alternateTextColor};
                position: absolute;
                bottom: 0;
                right: 0;
                margin: 5px;
                font-size: ${look.subSmallSize}px;
                font-family: ${look.font};
            }
            .footer-textbox {
                display: flex;
                flex-direction: column;
                margin: 20px;
            }
            .footer-contact {
                font-size: ${look.smallSize}px;
            }
        `}</style>
        <footer>
            <img src="static/assets/SVG/White-logo.svg" className="logo" alt="Shop logo" />
            <div className="footer-textbox">
                <span className="text-thin">Designed and developed by</span>
                <span className="text-bold">Petryk Yaroslav</span>
            </div>
            <div className="footer-contact">
                <div className="footer-textbox">
                    <span className="text-thin">Email</span>
                    <span className="text-bold"><a href="mailto:yaroslav.petryk@ukma.edu.ua">yaroslav.petryk@ukma.edu.ua</a></span>
                </div>
                <div className="footer-textbox">
                    <span className="text-thin">Personal website</span>
                    <span className="text-bold">Should I have one?</span>
                </div>
            </div>
            <span className="copyright ">© Petryk Yaroslav. 2019. Icon made from <a href="http://www.onlinewebfonts.com/icon">Icon Fonts</a> is licensed by CC BY 3.0</span>
        </footer>
    </>
}

export const AppFrame: React.FC<{ path?: string; name?: string }> = props => {
    let [theme, setTheme] = useState(Light)
    let { width } = useWindowBounds()
    let mobile: boolean = (width) ? width < 700 : false;
    let [hiddenSidebar, setHiddenSidebar] = useState(true)
    let dimmingRef = useRef<HTMLDivElement>(null)
    useClick(dimmingRef, () => {
        if (!hiddenSidebar) setHiddenSidebar(true)
    }, [hiddenSidebar])
    useKeyDown((e) => {
        if (!hiddenSidebar && e.key == "Escape") setHiddenSidebar(true)
    }, [hiddenSidebar])

    useEffect(() => {
        if (width && width < 700 && !hiddenSidebar) setHiddenSidebar(true)
        if (width && width > 700 && hiddenSidebar) setHiddenSidebar(false)
    }, [width])
    useEffect(() => {
        let match = window.matchMedia("(prefers-color-scheme: dark)").matches
        setTheme(match ? Dark : Light)

        function match_func({ matches }: MediaQueryListEvent) {
            if (matches) setTheme(Dark)
            else setTheme(Light)
        }
        window.matchMedia("(prefers-color-scheme: dark)").addListener(match_func)
        return () => window.matchMedia("(prefers-color-scheme: dark)").removeListener(match_func)
    }, [])

    return <>
        <link href="https://fonts.googleapis.com/css?family=Libre+Baskerville:700&display=swap" rel="stylesheet" />
        <ThemeContext.Provider value={theme}>
            <style global jsx>{`
                body {
                    margin: 0;
                    padding: 0;
                    background-color: ${theme.backgroundColor};
                }
                a {
                    color: inherit;
                }
            `}</style>
            <style jsx>{`
                .app {
                    display: flex;
                }
                .content {
                    width: 100%;
                    min-height: 100vh;
                    position: relative;
                    overflow-x: hidden;
                }
                .sidebar {
                    margin-right: 250px;
                }
                .dimmer {
                    width: 100vw;
                    height: 100vh;
                    position: fixed;
                    top: 0;
                    left: 0;
                    background-color: ${theme.dimmingColor};
                    opacity: 1;
                    z-index: 15;
                    transition: opacity 0.2s 0s ease-in;
                }
                .dimmer.hidden {
                    opacity: 0;
                    z-index: 0;
                }
                .spacer {
                    margin-right: 250px;
                }
            `}</style>
            <Head>
                <title>{"Fast Shop" + (props.name ? `: ${props.name}`: "")}</title>
            </Head>
            <div className="app">
                <Sidebar path={props.path} hidden={hiddenSidebar} />
                {mobile
                    ? <>
                        <div ref={dimmingRef} className={"dimmer" + (hiddenSidebar ? " hidden" : "")} />
                        <MobileHeader title={props.name || "Fast shop"} onHamburger={() => {
                            setHiddenSidebar(!hiddenSidebar)
                        }} />
                    </>
                    : <div className="spacer" />
                }
                <div className="content">
                    {props.children}
                    <VSpaced style={{ bottom: 0, width: "100%" }}>
                        <Footer />
                    </VSpaced>
                </div>
            </div>
        </ThemeContext.Provider>
    </>
}

interface StorefrontProps {
    sections?: SectionProps[];
    items?: StoreItem[];
}
export const Storefront: React.FC<StorefrontProps> = props => {
    let [shoppingCartItems, dispatch] = useReducer(SCReducer, { shown: false, items: [] })

    useEffect(() => {
        let version = localStorage.getItem("cart_version")
        if (!version || !(version == SHOPPING_CART_VERSION as any)) {
            localStorage.setItem("cart", JSON.stringify({ items: [] }))
            localStorage.setItem("cart_version", String(SHOPPING_CART_VERSION))
        } else {
            let cart = localStorage.getItem("cart")
            try {
                if (cart) dispatch({ type: SCActionType.reset, resetState: JSON.parse(cart) })
            } catch (e) {
                console.error(e)
            }
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(shoppingCartItems.items))
    }, [shoppingCartItems])

    let sections: JSX.Element[] = []
    const buyHandler = (item: StoreItem) => {
        dispatch({ type: SCActionType.add, id: item.id, count: 1, fallbackItem: item })
    }
    if (props.items) {
        sections.push(<Section items={props.items} key={-1} onBuy={buyHandler} />)
    }
    if (props.sections) {
        sections.push(...props.sections.map((props, index) => <Section {...props} key={index} onBuy={buyHandler} />))
    }
    return <ShoppingCartContext.Provider value={dispatch}>
        {sections}
        <ShoppingCart {...shoppingCartItems} />
    </ShoppingCartContext.Provider>
}
