import { StoreItem } from "../src/shared/components";
import { AppFrame, Storefront } from "../src/components/common";
import { NextPage } from "next";

interface AccessoriesPageProps {
    items: StoreItem[];
}
const AccessoriesPage: NextPage<AccessoriesPageProps> = props => <AppFrame path="/accessories" name="Hats and accessories">
    <Storefront items={props.items} />
</AppFrame>
AccessoriesPage.getInitialProps = async (ctx) => {
    return { items: require("../static/items/hats.json") }
}

export default AccessoriesPage