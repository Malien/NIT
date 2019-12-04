import { Tab, TabsView } from "../layout"
import { AssetsView } from "./assets"
import { ItemsView } from "./items"
import { OrdersView } from "./order"
import { TagsView } from "./tags"
import { UsersView } from "./users"

const AdminPanel: React.FC = props => {
    return <TabsView>
        <Tab title="Items">
            <ItemsView />
        </Tab>
        <Tab title="Tags">
            <TagsView />
        </Tab>
        <Tab title="Assets">
            <AssetsView />
        </Tab>
        <Tab title="Orders">
            <OrdersView />
        </Tab>
        <Tab title="Users">
            <UsersView />
        </Tab>
    </TabsView>
}

export default AdminPanel