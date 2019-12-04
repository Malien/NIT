import { NextPage } from "next";
import { TronCategory, StoreItem, Tag } from "../src/shared/components";
import { AppFrame } from "../src/components/common";
import { ProductView, NoProduct } from "../src/components/products";
// import { fetchItem as fetchItemNode, fetchCategories as fetchCategoriesNode } from "../src/api/nodeTron";
// import { toStoreItem, fetchItem, fetchCachedCategories } from "../src/api/tron";
import { fetchItems, fetchTags } from "../src/api/new";
import { fetchItems as fetchItemsNode, fetchTags as fetchTagsNode } from "../src/api/newNode";
import { ErrorMsg } from "../src/components/errors";

interface ProductPageProps {
    item?: StoreItem;
    tags: Tag[];
    err?: boolean;
}
/**
 * Page responsible for displaying full-sized product description. Hosted at /product
 * @param item item to be displayd
 * @param categoris categoris of the items
 * @param err if true error message is displayed
 */
const ProductPage: NextPage<ProductPageProps> = ({ item, tags, err }) => {
    let name = (item) ? item.name : "No item found"
    return <AppFrame
        tags={tags}
        name={name}
    >
        {err && <ErrorMsg msg="There was an error loading product" />}
        {item ? <ProductView {...item} /> : <NoProduct />}
    </AppFrame>
}

/**
 * @method Is called either on server on initial load, or on client if is navigated to.
 * Used to fetch initial props for page, such as items and categories.
 * @param query contains parsed page querry path extension. Used to pinpoint what should be fetched
 */
ProductPage.getInitialProps = async ({ req, query }) => {
    let id = query.id as any
    if (req) {
        // If req is set, than we are runnig in the server environment
        try {
            if (!id) return fetchTagsNode().then(tags => ({ tags }))
            let [item, tags] = await Promise.all([
                fetchItemsNode({ id }).then(items => item[0]),
                fetchTagsNode()
            ])
            return { item, tags }
        } catch (e) {
            try {
                // Try to fetch only categories
                let tags = await fetchTagsNode()
                return { tags, err: true }
            } catch (e) {
                return { tags: [], err: true }
            }
        }
    } else {
        try {
            if (!id) return fetchTagsNode().then(tags => ({ tags }))
            let [item, tags] = await Promise.all([
                fetchItems({ id }).then(items => item[0]),
                fetchTags()
            ])
            return { item, tags }
        } catch (e) {
            try {
                // Try to fetch only categories
                let tags = await fetchTags()
                return { tags, err: true }
            } catch (e) {
                return { tags: [], err: true }
            }
        }
    }
}

export default ProductPage