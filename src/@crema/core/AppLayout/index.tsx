import { Layout } from "antd";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";

type AppLayoutProps = React.PropsWithChildren;

function AppLayout({ children }: AppLayoutProps) {
    return (
        <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
            <AppHeader />

            <Layout.Content style={{ maxWidth: 1200, width: '100%', margin: '0 auto', padding: '24px 16px' }}>
                {children}
            </Layout.Content>

            <AppFooter />
        </Layout>
    )
}

export default AppLayout;