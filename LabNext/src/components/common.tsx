import Head from "next/head";
import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";
import { StoreItem, TronCategory } from "../shared/components";
import { useClick, useKeyDown, useMobileScroll, useWindowBounds } from "./hooks";
import { NoSSR, VSpaced } from "./layout";
import { Section, SectionProps } from "./section";
import { SCActionType, ShoppingCart, ShoppingCartContext, useShoppingCart } from "./shopping";
import { Dark, Light, LookContext, ThemeContext } from "./style";


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
                overflow: hidden;
                text-overflow: ellipsis;
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
    tooltip?: string;
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
                text-overflow: ellipsis;
                overflow: hidden;
                grid-column: 2;
                color: ${theme.alternateTextColor};
                font-family: ${look.font};
                font-size: ${props.selected ? look.largeSize : look.mediumSize}px;
                font-weight: ${props.selected ? 800 : 400};
                margin: 5px 0;
            }
        `}</style>
        <Link href={props.href}>
            <a title={props.tooltip}>
                <div>{props.thumb}</div>
                <span>{props.label}</span>
            </a>
        </Link>
    </>
}

interface SidebarProps {
    path?: string;
    hidden?: boolean;
    categories: TronCategory[];
}
export const Sidebar: React.FC<SidebarProps> = props => {
    let theme = useContext(ThemeContext)
    let links = props.categories.map(category =>
        <NavLink 
            key={category.id}
            selected={props.path == `/?category=${category.id}`} 
            label={category.name} 
            href={`/?category=${category.id}`}
            tooltip={category.description} 
        />
    )
    return <>
        <style jsx>{`
            .navigation {
                display: grid;
                grid-template-columns: 20px auto;
                margin: 10px;
            }
            header {
                z-index: 20;
                position: fixed;
                width: 270px;
                height: 100vh;
                background-color: ${theme.headerColor};
                box-shadow: ${theme.shadowColor} 5px 0px 8px;
                transition: transform 0.2s 0s ease-in;
            }
            header.hidden {
                transform: translateX(-280px);
            }
            img {
                margin: 5%;
                margin-top: 40px;
            }

            @media (min-width: 800px) {
                header.hidden {
                    transform: translateX(0);
                }
            }
        `}</style>
        <header className={(props.hidden ? " hidden" : "")}>
            <img src="static/assets/SVG/white-logo.svg" className="logo" alt="Shop logo" />
            <div className="navigation">
                <NavLink selected={props.path == "/"} label="All Items" href="/" />
                {links}
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
            .space {
                margin-top: 1em;
            }
            @media (max-width: 700px) {
                footer {
                    flex-direction: column;
                }
            }
        `}</style>
        <footer>
            <img src="static/assets/SVG/white-logo.svg" className="logo" alt="Shop logo" />
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
            <div className="space" />
            <span className="copyright ">© Petryk Yaroslav. 2019. Icon made from <a href="http://www.onlinewebfonts.com/icon">Icon Fonts</a> is licensed by CC BY 3.0</span>
        </footer>
    </>
}

interface AppFrameProps {
    path?: string;
    name?: string;
    categories: TronCategory[];
}
export const AppFrame: React.FC<AppFrameProps> = props => {
    let [theme, setTheme] = useState(Light)
    let { width } = useWindowBounds()
    let [mobile, setMobile] = useState((width) ? width < 800 : true);
    let [sidebarShown, setSidebarShown] = useState(!mobile)
    let dimmingRef = useRef<HTMLDivElement>(null)
    useClick(dimmingRef, () => {
        if (sidebarShown) setSidebarShown(false)
    }, [sidebarShown, mobile])
    useKeyDown((e) => {
        if (mobile && sidebarShown && e.key == "Escape") setSidebarShown(false)
    }, [sidebarShown, mobile])

    useEffect(() => {
        setMobile((width) ? width < 800 : true)
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

    let [shoppingCartItems, shoppingDispatch] = useShoppingCart()

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
                    position: relative;
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
                    margin-right: 270px;
                }
            `}</style>
            <Head>
                <title>{"Fast Shop" + (props.name ? `: ${props.name}` : "")}</title>
            </Head>
            <div className="app">
                <Sidebar path={props.path} hidden={!sidebarShown} categories={props.categories} />
                {!mobile ? <div className="spacer" /> : undefined}
                <NoSSR>
                    <div className="content">
                        {mobile && <>
                            <div ref={dimmingRef} className={"dimmer" + (sidebarShown ? "" : " hidden")} />
                            <MobileHeader title={props.name || "Fast shop"} onHamburger={() => {
                                setSidebarShown(!sidebarShown)
                            }} />
                        </>
                        }
                        <ShoppingCartContext.Provider value={shoppingDispatch}>
                            {props.children}
                            <ShoppingCart {...shoppingCartItems} />
                        </ShoppingCartContext.Provider>
                        <VSpaced style={{ bottom: 0, width: "100%" }}>
                            <Footer />
                        </VSpaced>
                    </div>
                </NoSSR>
            </div>
        </ThemeContext.Provider>
    </>
}

interface StorefrontProps {
    sections?: SectionProps[];
    items?: StoreItem[];
}
export const Storefront: React.FC<StorefrontProps> = props => {
    let dispatch = useContext(ShoppingCartContext)

    const buyHandler = (item: StoreItem) => {
        if (dispatch) dispatch({ type: SCActionType.add, id: item.id, count: 1, fallbackItem: item })
    }
    let sections: JSX.Element[] = []
    if (props.items) {
        sections.push(<Section items={props.items} key={-1} onBuy={buyHandler} />)
    }
    if (props.sections) {
        sections.push(...props.sections.map((sprops, index) => <Section {...sprops} key={index} onBuy={buyHandler} />))
    }
    return <>{sections}</>
}

interface ErrorMsgProps {
    prominent?: boolean;
    msg: string;
}
export const ErrorMsg: React.FC<ErrorMsgProps> = props => {
    let theme = useContext(ThemeContext)
    let look = useContext(LookContext)
    let [shown, setShown] = useState(false)

    useEffect(() => {
        if (!props.prominent && shown) {
            let handle = setTimeout(() => {
                setShown(false)
            }, 6000)
            return () => clearTimeout(handle)
        }
    }, [shown])
    useEffect(() => {
        setTimeout(() => setShown(true), 500)
    }, [])

    return <>
        <style jsx>{`
            span {
                color: ${theme.textColor};
                font-family: ${look.font};
                font-size: ${look.smallSize}px;
            }
            .container {
                padding: 10px 20px;
                display: flex;
                background-color: ${theme.mobileHeaderColor};
                box-shadow: ${theme.shadowColor} 3px 3px 10px 3px;
                transition: transform 0.4s 0s ease-in;
                position: fixed;
                z-index: 30;
                top: 0;
                transform: translateY(-200%);
                border-radius: calc( ( 2em + 20px ) / 2);
                margin: 20px;
                align-items: center;
            }
            .container.shown {
                transform: translateY(0);
            }
            .cross {
                appearance: none;
                border: none;
                background-color: ${theme.mobileHeaderColor};
                padding: 0;
                width: 30px;
                height: 30px;
                /* padding: 10px; */
                position: relative;
                margin-left: 5px;
                margin-right: -5px;
                border-radius: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .cross:active {
                background-color: ${theme.subbackgroundColor};
            }
            .cross:hover::before {
                background-color: ${theme.textColor}
            }
            .cross:hover::after {
                background-color: ${theme.textColor}
            }
            .cross::before {
                content: "";
                display: block;
                position: absolute;
                width: 66%;
                height: 2px;
                border-radius: 1px;
                background-color: ${theme.textSubcolor};
                transform: rotate(45deg);
            }
            .cross::after {
                content: "";
                display: block;
                position: absolute;
                width: 66%;
                height: 2px;
                border-radius: 1px;
                background-color: ${theme.textSubcolor};
                transform: rotate(-45deg);
            }
            .center {
                width: 100%;
                display: flex;
                justify-content: center;
            }
        `}</style>
        <div className="center">
            <div className={"container" + (shown ? " shown" : "")}>
                <span>{props.msg}</span>
                <button className="cross" onClick={() => setShown(false)} />
            </div>
        </div>
    </>
}