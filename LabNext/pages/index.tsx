import { StoreItem, TronCategory } from "../src/shared/components";
import { AppFrame, Storefront } from "../src/components/common";
import { NextPage } from "next";
import { fetchItems, toStoreItem, fetchCachedCategories } from "../src/api/tron";
import { fetchItems as fetchItemsNode, fetchCategories as fetchCategoriesNode } from "../src/api/nodeTron";
import { ErrorMsg } from "../src/components/errors";

interface LegginsPageProps {
    items: StoreItem[];
    categories: TronCategory[];
    category?: TronCategory;
    err?: boolean;
}
/**
 * Page responsible for displaying product grid page. Hosted at /product
 * @param item item to be displayd
 * @param categoris categoris of the items
 * @param category current selected category
 * @param err if true error message is displayed
 */
const StorefrontPage: NextPage<LegginsPageProps> = props =>
    <AppFrame
        path={props.category ? `/?category=${props.category.id}` : "/"}
        name={props.category && props.category.name}
        categories={props.categories}
    >
        {props.err && <ErrorMsg msg="Error occured while loading products" />}
        <Storefront items={props.items} />
    </AppFrame>

/**
 * @method Is called either on server on initial load, or on client if is navigated to.
 * Used to fetch initial props for page, such as items and categories.
 * @param query contains parsed page querry path extension. Used to pinpoint what should be fetched.
 */
StorefrontPage.getInitialProps = async ({ req, query }) => {
    let categoryQuery = query.category as string
    if (req) {
        // If req is set, than we are runnig in the server environment
        try {
            let [items, categories] = await Promise.all([
                fetchItemsNode(categoryQuery).then(toStoreItem),
                fetchCategoriesNode()
            ])
            let category = categories.find(cat => cat.id == categoryQuery)
            return { items, categories, category }
        } catch (e) {
            try {
                // Try to load only categories
                let categories = await fetchCategoriesNode()
                return { items: [], categories, err: true }
            } catch (e) {
                return { items: [], categories: [], err: true }
            }
        }
    } else {
        let [items, categories] = await Promise.all([
            fetchItems(categoryQuery).then(toStoreItem),
            fetchCachedCategories()
        ])
        let category = categories.find(cat => cat.id == categoryQuery)
        return { items, categories, category }
    }
}

export default StorefrontPage