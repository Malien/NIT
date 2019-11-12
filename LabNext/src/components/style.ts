import { createContext } from "react";

type kind = "dark" | "light"

/**
 * Colors defined to be used by current theme
 */
export interface Theme {
    mobileHeaderColor: any;
    kind: kind; // Used to respect browser theme settting
    headerColor: string;
    headerSubcolor: string;
    textColor: string;
    textSubcolor: string;
    alternateTextColor: string;
    alternateTextSubcolor: string;
    footerColor: string;
    backgroundColor: string;
    subbackgroundColor: string;
    shadowColor: string;
    alternativeColor: string;
    alternativeSubcolor: string;
    disabledColor: string;
    dimmingColor: string;
}

/**
 * Styles, such as fonts, and font-sizes that define the look of application
 */
export interface Look {
    font: string;
    strongFont: string;
    strongLineHeight: number;
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
    textSubcolor: "#777",
    alternateTextColor: "#fff",
    alternateTextSubcolor: "#d6d6d6",
    footerColor: "#707070",
    backgroundColor: "#fff",
    subbackgroundColor: "#eee",
    shadowColor: "#00000044",
    alternativeColor: "#aa00aa",
    alternativeSubcolor: "purple",
    disabledColor: "#999",
    dimmingColor: "#00000044",
    mobileHeaderColor: "#fff",
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
    subbackgroundColor: "#091C32",
    shadowColor: "#00000088",
    alternativeColor: "#aa00aa",
    alternativeSubcolor: "purple",
    disabledColor: "#585858",
    dimmingColor: "#00000088",
    mobileHeaderColor: "#091C32",
}

export const Vanila: Look = {
    font: "'Helvetica Neue', 'Helvetica', sans-serif",
    strongFont: "'Libre Baskerville', cursive",
    strongLineHeight: 1,
    extraLarge: 72,
    largeSize: 36,
    mediumSize: 28,
    smallSize: 20,
    subSmallSize: 16,
    boldWeight: 600
}

// React contexts used to acquire currently set theme inside components on demand, with state updates 'n stuff
export const ThemeContext = createContext(Light)
export const LookContext = createContext(Vanila)