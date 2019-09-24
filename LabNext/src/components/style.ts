import { createContext } from "react";

export interface Theme {
    headerColor: string;
    headerSubcolor: string;
    textColor: string;
    subtextColor: string;
    alternateTextColor: string;
    alternateTextSubcolor: string;
    footerColor: string;
    backgroundColor: string;
    shadowColor: string;
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
}

export const Light: Theme = {
    headerColor: "#3498db",
    headerSubcolor: "#5870D6",
    textColor: "#505050",
    subtextColor: "#909090",
    alternateTextColor: "#fff",
    alternateTextSubcolor: "#d6d6d6",
    footerColor: "#707070",
    backgroundColor: "#fff",
    shadowColor: "##00000044"
}

export const Dark: Theme = {
    headerColor: "#4A6488",
    headerSubcolor: "#223C5B",
    footerColor: "#091C32",
    textColor: "#d8d8d8",
    subtextColor: "#c2c2c2",
    alternateTextColor: "#fff",
    alternateTextSubcolor: "#d6d6d6",
    backgroundColor: "#293045",
    shadowColor: "#00000088"
}

export const Vanila: Look = {
    font: "'Helvetica Neue', sans-serif",
    strongFont: "'Libre Baskerville', cursive",
    stringLineHeight: 1,
    extraLarge: 72,
    largeSize: 36,
    mediumSize: 28,
    smallSize: 20,
    subSmallSize: 16
}

export const ThemeContext = createContext(Light)
export const LookContext = createContext(Vanila)