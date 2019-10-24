import { StoreItem } from "../src/shared/components";
import { AppFrame, Storefront } from "../src/components/common";
import { NextPage } from "next";

interface LegginsPageProps {
    items: StoreItem[];
}
const LegginsPage: NextPage<LegginsPageProps> = props => <AppFrame path="/leggins" name="Pants and leggins">
    <Storefront items={props.items} />
</AppFrame>
LegginsPage.getInitialProps = async (ctx) => {
    return { items: require("../static/items/leggins.json") }
}

export default LegginsPage