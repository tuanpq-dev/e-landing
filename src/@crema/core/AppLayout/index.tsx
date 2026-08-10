import { Layout } from "antd";
import { useLocation } from "react-router";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import "./AppLayout.css";

type AppLayoutProps = React.PropsWithChildren;

function AppLayout({ children }: AppLayoutProps) {
    const location = useLocation();

    // Check if the current path is Login or Register page
    const isAuthPage =
        location.pathname === "/login" ||
        location.pathname === "/register" ||
        location.pathname.startsWith("/login") ||
        location.pathname.startsWith("/register");

    if (isAuthPage) {
        return (
            <div className="auth-standalone-layout" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
                {children}
            </div>
        );
    }

    return (
        <Layout className="app-layout">
            <AppHeader />

            <Layout.Content className="app-content">
                {children}
            </Layout.Content>

            <AppFooter />
        </Layout>
    );
}

export default AppLayout;