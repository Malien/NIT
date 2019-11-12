import { useContext } from "react";
import { StoreItem } from "../shared/components";
import { BuyButton, splitName, StarRating } from "./grid-item";
import { SCActionType, ShoppingCartContext } from "./shopping";
import { LookContext, ThemeContext } from "./style";

/**
 * Displays store item in a full-page kind of style.
 * @param props Just a StoreItem to be displayed
 */
export const ProductView: React.FC<StoreItem> = props => {
    let theme = useContext(ThemeContext)
    let look = useContext(LookContext)
    let dispatch = useContext(ShoppingCartContext)

    let [name1, name2] = splitName(props.name)

    return <>
        <style jsx>{`
            .title {
                color: ${theme.textColor};
                font-family: ${look.strongFont};
                font-size: ${look.extraLarge}px;
                line-height: ${look.strongLineHeight};
                z-index: 2;
                display: inline-block;
            }
            .item {
                max-width: 1200px;
                padding: 20px;
                margin: auto;
                position: relative;
            }
            .undertitle {
                display: flex;
                justify-content: space-between;
            }
            .desc {
                margin: 40px 0;
                color: ${theme.textColor};
                font-family: ${look.font};
                font-size: ${look.largeSize};
            }
            @media (max-width: 400px) {
                .undertitle {
                    flex-direction: column;
                }
                .title {
                    font-size: ${look.largeSize}px;
                }
            }
        `}</style>
        <div className="item">
            <ProductPreview image={props.previews[0]} alt={`${props.name} preview`} />
            <div className="title">
                {name1}
                <br />
                {name2}
                <div className="undertitle">
                    <StarRating rating={props.rating} />
                    <BuyButton outOfStock={props.outOfStock} onClick={() => {
                        if (dispatch) dispatch({ type: SCActionType.add, id: props.id, fallbackItem: props, count: 1 })
                    }} />
                </div>
            </div>
            <div className="desc">
                {props.description}
            </div>
        </div>
    </>
}

interface ProductPreviewProps {
    image: string;
    alt?: string;
}
/**
 * Header portion of ProductView used to display single product image / prewied
 * @param props image url, and optional alt img atribute
 */
export const ProductPreview: React.FC<ProductPreviewProps> = props => {
    let theme = useContext(ThemeContext)
    return <>
        <style jsx>{`
            .container {
                max-width: 100%;
                position: relative;
                display: flex;
                flex-direction: column;
            }
            img {
                max-width: 100%;
                max-height: 500px;
                object-fit: contain;
            }
            .grad {
                width: 100%;
                height: 20%;
                position: absolute;
                bottom: 0;
                background: linear-gradient(180deg, ${theme.backgroundColor}00 0%, ${theme.backgroundColor} 100%);
                z-index: 1;
            }
        `}</style>
        <div className="container">
            <img src={props.image} alt={props.alt} />
            <div className="grad" />
        </div>
    </>
}

export const NoProduct: React.FC = props => {
    let theme = useContext(ThemeContext)
    let look = useContext(LookContext)

    return <>
        <style jsx>{`
            div {
                width: 100%;
                height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                color: ${theme.textSubcolor};
                font-family: ${look.font};
                font-size: ${look.extraLarge}px;
            }
        `}</style>
        <div>
            Cannot find this product
        </div>
    </>
}