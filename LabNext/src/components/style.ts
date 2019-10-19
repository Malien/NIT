import { createContext } from "react";

type kind = "dark" | "light"

export interface Theme {
    kind: kind;
    headerColor: string;
    headerSubcolor: string;
    textColor: string;
    textSubcolor: string;
    alternateTextColor: string;
    alternateTextSubcolor: string;
    footerColor: string;
    backgroundColor: string;
    shadowColor: string;
    alternativeColor: string;
    alternativeSubcolor: string;
    disabledColor: string;
}

export interface Look {
    font: string;
    strongFont: string;
    stringLineHeight: number;
    extraLarge: number;
    largeSize: number;
    mediumSize: number;
    smallSize: number;
    subSmallSize: number;
    boldWeight: number;
}

export const Light: Theme = {
    kind: "light",
    headerColor: "#3498db",
    headerSubcolor: "#5870D6",
    textColor: "#505050",
    textSubcolor: "#5f5f5f",
    alternateTextColor: "#fff",
    alternateTextSubcolor: "#d6d6d6",
    footerColor: "#707070",
    backgroundColor: "#fff",
    shadowColor: "#00000044",
    alternativeColor: "#aa00aa",
    alternativeSubcolor: "purple",
    disabledColor: "#606060"
}

export const Dark: Theme = {
    kind: "dark",
    headerColor: "#4A6488",
    headerSubcolor: "#223C5B",
    footerColor: "#091C32",
    textColor: "#d8d8d8",
    textSubcolor: "#949494",
    alternateTextColor: "#fff",
    alternateTextSubcolor: "#d6d6d6",
    backgroundColor: "#293045",
    shadowColor: "#00000088",
    alternativeColor: "#aa00aa",
    alternativeSubcolor: "purple",
    disabledColor: "#383838"
}

export const Vanila: Look = {
    font: "'Helvetica Neue', sans-serif",
    strongFont: "'Libre Baskerville', cursive",
    stringLineHeight: 1,
    extraLarge: 72,
    largeSize: 36,
    mediumSize: 28,
    smallSize: 20,
    subSmallSize: 16,
    boldWeight: 600
}

export const ThemeContext = createContext(Light)
export const LookContext = createContext(Vanila)