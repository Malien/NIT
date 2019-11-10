import { StoreItem, TronCategory, TronItem } from "../src/shared/components";
import { AppFrame, Storefront, ErrorMsg } from "../src/components/common";
import { NextPage } from "next";
import { fetchItems, toStoreItem, fetchCachedCategories } from "../src/api/tron";
import { fetchItems as fetchItemsNode, fetchCategories as fetchCategoriesNode } from "../src/api/nodeTron";
// import { fetchItems } from "../src/api/browser";

interface LegginsPageProps {
    items: StoreItem[];
    categories: TronCategory[];
    category?: TronCategory;
    err?: boolean;
}
const StorefrontPage: NextPage<LegginsPageProps> = props =>
    <AppFrame 
        path={props.category ? `/?category=${props.category.id}` : "/"} 
        name={props.category && props.category.name}
        categories={props.categories}
    >
        {props.err && <ErrorMsg msg="Error occured while loading products" />}
        <Storefront items={props.items} />
    </AppFrame>

StorefrontPage.getInitialProps = async ({ req, query }) => {
    let categoryQuery = query.category as string
    if (req) {
        let [items, categories] = await Promise.all([
            fetchItemsNode(categoryQuery).then(toStoreItem),
            fetchCategoriesNode()
        ])
        let category = categories.find(cat => cat.id == categoryQuery)
        return { items, categories, category }
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