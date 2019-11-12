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
/**
 * Page responsible for displaying full-sized product description. Hosted at /product
 * @param item item to be displayd
 * @param categoris categoris of the items
 * @param err if true error message is displayed
 */
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

/**
 * @method Is called either on server on initial load, or on client if is navigated to.
 * Used to fetch initial props for page, such as items and categories.
 * @param query contains parsed page querry path extension. Used to pinpoint what should be fetched
 */
ProductPage.getInitialProps = async ({ req, query }) => {
    let id = query.id as string
    if (req) {
        // If req is set, than we are runnig in the server environment
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