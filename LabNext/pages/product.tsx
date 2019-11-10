import { NextPage } from "next";
import { TronCategory, StoreItem } from "../src/shared/components";
import { AppFrame } from "../src/components/common";
import { ProductView, NoProduct } from "../src/components/products";
import { fetchItem as fetchItemNode, fetchCategories as fetchCategoriesNode } from "../src/api/nodeTron";
import { toStoreItem, fetchItem, fetchCachedCategories } from "../src/api/tron";
import { ErrorMsg } from "../src/components/errors";

interface ProductPageProps {
    item?: StoreItem;
    categories: TronCategory[];
    err?: boolean;
}
const ProductPage: NextPage<ProductPageProps> = ({ item, categories, err }) => {
    let name = (item) ? item.name : "No item found"
    return <AppFrame
        categories={categories}
        name={name}
    >
        {err && <ErrorMsg msg="There was an error loading product"/>}
        {item ? <ProductView {...item} /> : <NoProduct />}
    </AppFrame>
}

ProductPage.getInitialProps = async ({ req, query }) => {
    let id = query.id as string
    if (req) {
        try {
            if (!id) return fetchCategoriesNode().then(categories => ({ categories }))
            let [item, categories] = await Promise.all([
                fetchItemNode(id).then(item => toStoreItem(item)),
                fetchCategoriesNode()
            ])
            return { item, categories }
        } catch (e) {
            try {
                // Try to fetch only categories
                let categories = await fetchCategoriesNode()
                return { categories, err: true }
            } catch (e) {
                return { categories: [], err: true }
            }
        }
    } else {
        try {
            if (!id) return fetchCategoriesNode().then(categories => ({ categories }))
            let [item, categories] = await Promise.all([
                fetchItem(id).then(item => toStoreItem(item)),
                fetchCachedCategories()
            ])
            return { item, categories }
        } catch (e) {
            try {
                // Try to fetch only categories
                let categories = await fetchCachedCategories()
                return { categories, err: true }
            } catch (e) {
                return { categories: [], err: true }
            }
        }
    }
}

export default ProductPage