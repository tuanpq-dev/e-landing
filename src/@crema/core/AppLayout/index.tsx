import { Layout } from "antd";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import "./AppLayout.css";

type AppLayoutProps = React.PropsWithChildren;

function AppLayout({ children }: AppLayoutProps) {
    return (
        <Layout className="app-layout">
            <AppHeader />

            <Layout.Content className="app-content">
                {children}
            </Layout.Content>

            <AppFooter />
        </Layout>
    )
}

export default AppLayout;