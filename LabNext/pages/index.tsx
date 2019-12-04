import { StoreItem, TronCategory, Tag } from "../src/shared/components";
import { AppFrame, Storefront } from "../src/components/common";
import { NextPage } from "next";
import { fetchItems, fetchTags /* TODO: implement fetchCachedTags */ } from "../src/api/new";
import { fetchItems as fetchItemsNode, fetchTags as fetchTagsNode } from "../src/api/newNode";
import { ErrorMsg } from "../src/components/errors";

interface LegginsPageProps {
    items: StoreItem[];
    tags: Tag[];
    tag?: Tag;
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
        path={props.tag ? `/?tag=${props.tag.id}` : "/"}
        name={props.tag && props.tag.name}
        tags={props.tags}
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
    let categoryQuery = query.tag as string
    if (req) {
        // If req is set, than we are runnig in the server environment
        try {
            let [items, tags] = await Promise.all([
                fetchItemsNode(query),
                fetchTagsNode()
            ])
            let tag = tags.find(cat => String(cat.id) == categoryQuery)
            return { items, tags, tag }
        } catch (e) {
            console.error(e)
            try {
                // Try to load only categories
                let tags = await fetchTagsNode()
                let tag = tags.find(cat => String(cat.id) == categoryQuery)
                return { items: [], tags, tag, err: true }
            } catch (e) {
                console.error(e)
                return { items: [], tags: [], err: true }
            }
        }
    } else {
        let [items, tags] = await Promise.all([
            fetchItems(query),
            fetchTags()
        ])
        let tag = tags.find(cat => String(cat.id) == categoryQuery)
        return { items, tags, tag }
    }
}

export default StorefrontPage