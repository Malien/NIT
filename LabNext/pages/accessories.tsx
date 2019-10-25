import { StoreItem } from "../src/shared/components";
import { AppFrame, Storefront, ErrorMsg } from "../src/components/common";
import { NextPage } from "next";
import { fetchItems } from "../src/api/browser";

interface AccessoriesPageProps {
    items: StoreItem[];
    err?: boolean;
}
const AccessoriesPage: NextPage<AccessoriesPageProps> = props => <AppFrame path="/accessories" name="Hats and accessories">
    {props.err && <ErrorMsg msg="Error occured while loading products" />}
    <Storefront items={props.items} />
</AppFrame>
AccessoriesPage.getInitialProps = async ({req}) => {
    if (req) {
        return { items: require("../static/items/hats.json") }
    } else return fetchItems({items: "/static/items/hats.json"}, [])
}

export default AccessoriesPage