import { StoreItem } from "../src/shared/components";
import { AppFrame, Storefront } from "../src/components/common";
import { NextPage } from "next";

interface TopsPageProps {
    items: StoreItem[];
}
const TopsPage: NextPage<TopsPageProps> = props => <AppFrame path="/tops">
    <Storefront items={props.items} />
</AppFrame>
TopsPage.getInitialProps = async (ctx) => {
    return { items: require("../static/items/tops.json") }
}

export default TopsPage