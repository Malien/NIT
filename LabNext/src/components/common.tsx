import React, { useContext, useState, useEffect, useRef } from "react"
import Link from "next/link"

import { ThemeContext, LookContext, Light, Dark } from "./style";
import { VSpaced } from "./layout";

//TODO: provide default image for product
export const defaultImage = "";

interface NavLinkProps {
    thumb: string;
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
            img {
                grid-column: 1;
                width: 100%;
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
                <img src={props.thumb} />
                <span>{props.label}</span>
            </a>
        </Link>
    </>
}

export const Sidebar: React.FC = props => {
    let theme = useContext(ThemeContext)
    return <>
        <style jsx>{`
            .navigation {
                display: grid;
                grid-template-columns: 50px auto;
                margin: 10px;
            }
            header {
                position: fixed;
                width: 250px;
                height: 100vh;
                background-color: ${theme.headerColor};
            }
            img {
                margin: 5%;
                margin-top: 40px;
            }
            .spacer {
                margin-right: 250px;
            }
        `}</style>
        <header>
            <img src="static/SVG/White-logo.svg" className="logo" alt="Shop logo" />
            <div className="navigation">
                <NavLink selected thumb="" label="label" href="/" />
                <NavLink thumb="" label="label2" href="/" />
                <NavLink thumb="" label="label4" href="/" />
            </div>
        </header>
        <div className="spacer" />
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
            <img src="static/SVG/White-logo.svg" className="logo" alt="Shop logo" />
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

export const AppFrame: React.FC = props => {
    let [theme, setTheme] = useState(Light)

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
            `}</style>
            <div className="app">
                <Sidebar />
                <div className="content">
                    {props.children}
                    <VSpaced style={{ bottom: 0, width: "100%"}}>
                        <Footer />
                    </VSpaced>
                </div>
            </div>
        </ThemeContext.Provider>
    </>
}
