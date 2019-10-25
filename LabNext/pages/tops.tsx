import { StoreItem } from "../src/shared/components";
import { AppFrame, Storefront, ErrorMsg } from "../src/components/common";
import { NextPage } from "next";
import { fetchItems } from "../src/api/browser";

interface TopsPageProps {
    items: StoreItem[];
    err?: boolean;
}
const TopsPage: NextPage<TopsPageProps> = props => <AppFrame path="/tops" name="Jackets and tops">
    {props.err && <ErrorMsg msg="Error occured while loading products" />}
    <Storefront items={props.items} />
</AppFrame>
TopsPage.getInitialProps = async ({req}) => {
    if (req) {
        return { items: require("../static/items/tops.json") }
    } else return fetchItems({items: "/static/items/tops.json"}, [])
}

export default TopsPage