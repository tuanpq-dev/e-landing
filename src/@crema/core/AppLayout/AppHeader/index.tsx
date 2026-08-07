import { useState } from "react";
import {
    DownOutlined,
    FileTextOutlined,
    HeartOutlined,
    LogoutOutlined,
    MenuOutlined,
    RightOutlined,
    SearchOutlined,
    ShoppingCartOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Layout, Popover } from "antd";
import type { MenuProps } from "antd";
import { useLocation, useNavigate } from "react-router";
import config from "../../../../config/config";
import "./AppHeader.css";

const { Header } = Layout;

interface CategoryItem {
    id: string;
    title: string;
    subcategories?: string[];
}

const categoriesData: CategoryItem[] = [
    {
        id: "t-shirt",
        title: "Áo thun",
        subcategories: ["Áo thun basic", "Áo thun chất", "Áo thun đôi"],
    },
    {
        id: "jeans",
        title: "Quần Jeans",
        subcategories: ["Quần Jeans cao cấp", "Quần Jeans ống xuông", "Quần Jeans cạp chun", "Quần Jeans rách gối"],
    },
    {
        id: "underware",
        title: "Đồ lót",
        subcategories: ["Boxer", "Sịp tam giác", "Boxer trái tim", "Boxer Spiderman"],
    },
    {
        id: "set",
        title: "Bộ",
        subcategories: ["Bộ mùa đông", "Bộ dài tay", "Bộ phá cách"],
    },
];

const sampleCartItems = [
    {
        id: 1,
        name: "Sofa Băng Da Cao Cấp Sea Luxe",
        price: "12.500.000₫",
        variant: "Màu Nâu Bò / Kích thước 2m",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=80&q=80",
    },
    {
        id: 2,
        name: "Bàn Trà Gỗ Gõ Đỏ Hiện Đại",
        price: "4.800.000₫",
        variant: "Mặt Gỗ Chân Sắt",
        image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=80&q=80",
    },
];

function AppHeader() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/${config.routes.PRODUCT}?search=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            navigate(`/${config.routes.PRODUCT}`);
        }
    };

    const isCurrentRoute = (path: string) => {
        if (path === "/" || path === "home") {
            return location.pathname === "/" || location.pathname === "/home";
        }
        const target = path.startsWith("/") ? path : `/${path}`;
        return location.pathname.startsWith(target);
    };


    // User Profile Dropdown Menu
    const userMenuItems: MenuProps["items"] = [
        {
            key: "profile",
            icon: <UserOutlined />,
            label: "Tài khoản của tôi",
            onClick: () => navigate(`/${config.routes.PROFILE}`),
        },
        {
            key: "order",
            icon: <FileTextOutlined />,
            label: "Đơn hàng của tôi",
            onClick: () => navigate(`/${config.routes.ORDER}`),
        },
        {
            key: "wishlist",
            icon: <HeartOutlined />,
            label: "Sản phẩm yêu thích",
            onClick: () => navigate(`/${config.routes.WISHLIST}`),
        },
        {
            type: "divider",
        },
        {
            key: "logout",
            icon: <LogoutOutlined />,
            label: "Đăng xuất",
            onClick: () => navigate(`/${config.routes.LOGIN}`),
        },
    ];

    // Mini Cart Popover Content
    const cartPopoverContent = (
        <div style={{ width: 340, padding: 4 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: "#22242a", marginBottom: 10, paddingBottom: 6, borderBottom: "1px solid #eee" }}>
                Giỏ hàng của bạn (2 sản phẩm)
            </div>
            {sampleCartItems.map((item) => (
                <div
                    key={item.id}
                    onClick={() => navigate(`/${config.routes.CART}`)}
                    style={{ display: "flex", gap: 10, marginBottom: 10, cursor: "pointer" }}
                >
                    <img src={item.image} alt={item.name} style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 4 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "#333", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {item.name}
                        </div>
                        <div style={{ fontSize: 11, color: "#888" }}>{item.variant}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#c89968", marginTop: 2 }}>{item.price}</div>
                    </div>
                </div>
            ))}
            <div style={{ borderTop: "1px solid #eee", paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#666" }}>Tổng tiền: <strong style={{ color: "#c89968", fontSize: 13 }}>17.300.000₫</strong></span>
                <Button
                    type="primary"
                    size="small"
                    onClick={() => navigate(`/${config.routes.CART}`)}
                    style={{ backgroundColor: "#22242a", borderColor: "#22242a" }}
                >
                    Xem Giỏ Hàng
                </Button>
            </div>
        </div>
    );

    return (
        <Header className="sea-header">
            {/* Top Mid Header */}
            <div className="sea-header-top">
                <div className="sea-header-container">
                    {/* Brand Logo */}
                    <div className="sea-brand" onClick={() => navigate("/")}>
                        <img
                            src="/favicon.svg"
                            alt="E-commerce logo"
                            style={{ width: 40, height: 40, objectFit: "contain" }}
                        />
                        <div className="sea-brand-text">
                            <span className="sea-brand-name">Essential</span>
                            <span className="sea-brand-tagline">Thời trang cao cấp</span>
                        </div>
                    </div>

                    {/* Central Search Bar */}
                    <div className="sea-search-wrapper">
                        <div className="sea-search-box">
                            <input
                                className="sea-search-input"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                placeholder="Nhập từ khóa tìm kiếm sản phẩm thời trang..."
                            />
                            <Button
                                className="sea-search-btn"
                                icon={<SearchOutlined style={{ fontSize: 16 }} />}
                                onClick={handleSearch}
                            />
                        </div>
                    </div>

                    {/* Right Header Actions */}
                    <div className="sea-header-actions">
                        <div className="sea-account-links">
                            <span className="sea-account-link" onClick={() => navigate(`/${config.routes.RESGISTER}`)}>
                                Đăng ký
                            </span>
                            <span className="sea-account-divider">|</span>
                            <Dropdown menu={{ items: userMenuItems }} trigger={["click", "hover"]} placement="bottomRight">
                                <span className="sea-user-badge">
                                    <Avatar size={22} icon={<UserOutlined />} style={{ backgroundColor: "#22242a" }} />
                                    <span>Đăng nhập</span>
                                </span>
                            </Dropdown>
                        </div>

                        {/* Mini Cart Widget */}
                        <Popover content={cartPopoverContent} trigger="hover" placement="bottomRight">
                            <div className="sea-cart-widget" onClick={() => navigate(`/${config.routes.CART}`)}>
                                <ShoppingCartOutlined className="sea-cart-icon" />
                                <div className="sea-cart-info">
                                    <span className="sea-cart-label">Giỏ hàng</span>
                                    <span className="sea-cart-count">2 sản phẩm</span>
                                </div>
                            </div>
                        </Popover>
                    </div>
                </div>
            </div>

            {/* Main Navigation Bar */}
            <div className="sea-nav-bar">
                <div className="sea-nav-container">
                    {/* Vertical Category Button & Dropdown Menu */}
                    <div
                        className="sea-category-wrapper"
                        onMouseEnter={() => setCategoryOpen(true)}
                        onMouseLeave={() => {
                            setCategoryOpen(false);
                            setActiveCategory(null);
                        }}
                    >
                        <div className="sea-category-btn">
                            <div className="sea-category-title">
                                <MenuOutlined />
                                <span>Danh mục sản phẩm</span>
                            </div>
                            <DownOutlined style={{ fontSize: 11 }} />
                        </div>

                        {/* Vertical Dropdown Menu */}
                        {categoryOpen && (
                            <div className="sea-category-menu">
                                {categoriesData.map((cat) => (
                                    <div
                                        key={cat.id}
                                        className="sea-category-item"
                                        onMouseEnter={() => setActiveCategory(cat.id)}
                                        onClick={() => {
                                            navigate(`/${config.routes.PRODUCT}?category=${cat.id}`);
                                            setCategoryOpen(false);
                                        }}
                                    >
                                        <span>{cat.title}</span>
                                        {cat.subcategories && <RightOutlined style={{ fontSize: 10, opacity: 0.6 }} />}

                                        {/* Subcategory Mega Panel */}
                                        {activeCategory === cat.id && cat.subcategories && (
                                            <div className="sea-subcategory-panel">
                                                {cat.subcategories.map((sub, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="sea-subcategory-item"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/${config.routes.PRODUCT}?sub=${encodeURIComponent(sub)}`);
                                                            setCategoryOpen(false);
                                                        }}
                                                    >
                                                        {sub}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Route Navigation Menu (Font Size: 14px) */}
                    <ul className="sea-nav-menu">
                        <li
                            className={`sea-nav-route ${isCurrentRoute("/") ? "active" : ""}`}
                            onClick={() => navigate("/")}
                        >
                            Trang chủ
                        </li>
                        <li
                            className={`sea-nav-route ${isCurrentRoute("about") ? "active" : ""}`}
                            onClick={() => navigate(`/${config.routes.ABOUT}`)}
                        >
                            Giới thiệu
                        </li>
                        <li
                            className={`sea-nav-route ${isCurrentRoute("product") ? "active" : ""}`}
                            onClick={() => navigate(`/${config.routes.PRODUCT}`)}
                        >
                            Sản phẩm
                        </li>
                        <li
                            className={`sea-nav-route ${isCurrentRoute("news") ? "active" : ""}`}
                            onClick={() => navigate(`/${config.routes.NEWS}`)}
                        >
                            Tin tức
                        </li>
                        <li
                            className={`sea-nav-route ${isCurrentRoute("contact") ? "active" : ""}`}
                            onClick={() => navigate(`/${config.routes.CONTACT}`)}
                        >
                            Liên hệ
                        </li>
                    </ul>
                </div>
            </div>
        </Header>
    );
}

export default AppHeader;