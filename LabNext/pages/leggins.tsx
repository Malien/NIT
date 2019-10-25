import { StoreItem } from "../src/shared/components";
import { AppFrame, Storefront, ErrorMsg } from "../src/components/common";
import { NextPage } from "next";
import { fetchItems } from "../src/api/browser";

interface LegginsPageProps {
    items: StoreItem[];
    err?: boolean;
}
const LegginsPage: NextPage<LegginsPageProps> = props => <AppFrame path="/leggins" name="Pants and leggins">
    {props.err && <ErrorMsg msg="Error occured while loading products" />}
    <Storefront items={props.items} />
</AppFrame>
LegginsPage.getInitialProps = async ({req}) => {
    if (req) {
        return { items: require("../static/items/leggins.json") }
    } else {
        return fetchItems({
            items: "/static/items/leggins.json"
        }, [])
    }
}

export default LegginsPage