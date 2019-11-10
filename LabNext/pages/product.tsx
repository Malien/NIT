import { NextPage } from "next";
import { TronCategory, StoreItem } from "../src/shared/components";
import { AppFrame } from "../src/components/common";

interface ProductPageProps {
    item: StoreItem;
    categories: TronCategory[];
    err?: boolean;
}
const ProductPage: NextPage<ProductPageProps> = ({ item, categories }) =>
    <AppFrame
        categories={categories}
        name={item.name}
        path={`/product?id=${item.id}`}
    >

    </AppFrame>

ProductPage.getInitialProps = async ({req}) => {
    if (req) {
        // Server-side fetching
    } else {
        // Client-side fetching
    }
}
        
export default ProductPage