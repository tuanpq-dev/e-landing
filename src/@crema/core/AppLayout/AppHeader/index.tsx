import { useState, useEffect } from "react";
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
import { Avatar, Button, Dropdown, Layout, Popover, message } from "antd";
import type { MenuProps } from "antd";
import { useLocation, useNavigate } from "react-router";
import config from "../../../../config/config";
import { URL } from "../../../../config/apiUrl";
import axiosClient from "../../../../api/axiosClient";
import "./AppHeader.css";

const { Header } = Layout;

interface UserInfo {
    id?: number;
    email?: string;
    fullname?: string;
    image?: string;
    role?: string;
}

interface CategoryItem {
    id: number;
    name: string;
    children?: CategoryItem[];
}

function AppHeader() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<number | null>(null);
    const [categories, setCategories] = useState<CategoryItem[]>([]);

    const [user, setUser] = useState<UserInfo | null>(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            try {
                return JSON.parse(savedUser);
            } catch {
                return null;
            }
        }
        return null;
    });

    // Fetch Categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res: any = await axiosClient.post(`${URL}/category/search`, {});
                if (res && res.data) {
                    setCategories(res.data);
                }
            } catch (err) {
                console.error("Fetch header categories error:", err);
            }
        };

        fetchCategories();
    }, []);

    // Fetch User Info & Listen for Auth changes
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                try {
                    const res: any = await axiosClient.get(`${URL}/auth/me`);
                    if (res) {
                        setUser(res);
                        localStorage.setItem("user", JSON.stringify(res));
                    }
                } catch {
                    // Token expired or invalid
                }
            }
        };

        fetchUserData();

        const handleAuthChange = () => {
            const savedUser = localStorage.getItem("user");
            if (savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                } catch {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        window.addEventListener("auth-change", handleAuthChange);
        window.addEventListener("storage", handleAuthChange);
        return () => {
            window.removeEventListener("auth-change", handleAuthChange);
            window.removeEventListener("storage", handleAuthChange);
        };
    }, []);

    // Cart State & Sync
    const [cartItems, setCartItems] = useState<any[]>(() => {
        const saved = localStorage.getItem("cart");
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return [];
            }
        }
        return [];
    });

    useEffect(() => {
        const handleCartChange = () => {
            const saved = localStorage.getItem("cart");
            if (saved) {
                try {
                    setCartItems(JSON.parse(saved));
                } catch {
                    setCartItems([]);
                }
            } else {
                setCartItems([]);
            }
        };

        window.addEventListener("cart-change", handleCartChange);
        window.addEventListener("storage", handleCartChange);
        return () => {
            window.removeEventListener("cart-change", handleCartChange);
            window.removeEventListener("storage", handleCartChange);
        };
    }, []);

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
            onClick: async () => {
                try {
                    await axiosClient.post(`${URL}/auth/logout`);
                } catch (err) {
                    console.error("Logout API error:", err);
                } finally {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("user");
                    setUser(null);
                    window.dispatchEvent(new Event("auth-change"));
                    message.success("Đã đăng xuất tài khoản thành công!");
                    navigate(`/${config.routes.LOGIN}`);
                }
            },
        },
    ];

    // Mini Cart Popover Content
    const totalCartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
    const totalCartPrice = cartItems.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);

    const cartPopoverContent = (
        <div style={{ width: 340, padding: 4 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: "#22242a", marginBottom: 10, paddingBottom: 6, borderBottom: "1px solid #eee" }}>
                Giỏ hàng của bạn ({totalCartCount} sản phẩm)
            </div>
            {cartItems.length === 0 ? (
                <div style={{ padding: "20px 0", textAlign: "center", color: "#888", fontSize: 13 }}>
                    Giỏ hàng đang trống
                </div>
            ) : (
                cartItems.slice(0, 4).map((item, idx) => (
                    <div
                        key={item.cartItemId || idx}
                        onClick={() => navigate(`/${config.routes.CART}`)}
                        style={{ display: "flex", gap: 10, marginBottom: 10, cursor: "pointer" }}
                    >
                        <img src={item.image} alt={item.name} style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 4 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: "#333", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {item.name}
                            </div>
                            <div style={{ fontSize: 11, color: "#888" }}>{item.variant} x {item.quantity}</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#c89968", marginTop: 2 }}>
                                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price * item.quantity)}
                            </div>
                        </div>
                    </div>
                ))
            )}
            {cartItems.length > 4 && (
                <div style={{ fontSize: 11, color: "#888", textAlign: "center", marginBottom: 8 }}>
                    Và {cartItems.length - 4} sản phẩm khác...
                </div>
            )}
            <div style={{ borderTop: "1px solid #eee", paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#666" }}>
                    Tổng tiền: <strong style={{ color: "#c89968", fontSize: 13 }}>
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalCartPrice)}
                    </strong>
                </span>
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
                            {user ? (
                                <Dropdown menu={{ items: userMenuItems }} trigger={["hover"]} placement="bottomRight">
                                    <span className="sea-user-badge" style={{ cursor: "pointer" }}>
                                        <Avatar
                                            size={24}
                                            src={user.image}
                                            icon={!user.image && <UserOutlined />}
                                            style={{ backgroundColor: "#22242a" }}
                                        />
                                        <span style={{ fontWeight: 500 }}>
                                            {user.fullname || user.email?.split("@")[0]}
                                        </span>
                                    </span>
                                </Dropdown>
                            ) : (
                                <>
                                    <span className="sea-account-link" onClick={() => navigate(`/${config.routes.RESGISTER}`)}>
                                        Đăng ký
                                    </span>
                                    <span className="sea-account-divider">|</span>
                                    <span className="sea-user-badge" onClick={() => navigate(`/${config.routes.LOGIN}`)}>
                                        <Avatar size={22} icon={<UserOutlined />} style={{ backgroundColor: "#22242a" }} />
                                        <span>Đăng nhập</span>
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Mini Cart Widget */}
                        <Popover content={cartPopoverContent} trigger="hover" placement="bottomRight">
                            <div className="sea-cart-widget" onClick={() => navigate(`/${config.routes.CART}`)}>
                                <ShoppingCartOutlined className="sea-cart-icon" />
                                <div className="sea-cart-info">
                                    <span className="sea-cart-label">Giỏ hàng</span>
                                    <span className="sea-cart-count">{totalCartCount} sản phẩm</span>
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
                                {categories.length === 0 ? (
                                    <div style={{ padding: "12px 16px", color: "#888", fontSize: 13 }}>
                                        Đang tải danh mục...
                                    </div>
                                ) : (
                                    categories.map((cat) => (
                                        <div
                                            key={cat.id}
                                            className="sea-category-item"
                                            onMouseEnter={() => setActiveCategory(cat.id)}
                                            onClick={() => {
                                                navigate(`/${config.routes.PRODUCT}?category=${cat.id}`);
                                                setCategoryOpen(false);
                                            }}
                                        >
                                            <span>{cat.name}</span>
                                            {cat.children && cat.children.length > 0 && (
                                                <RightOutlined style={{ fontSize: 10, opacity: 0.6 }} />
                                            )}

                                            {/* Subcategory Mega Panel */}
                                            {activeCategory === cat.id && cat.children && cat.children.length > 0 && (
                                                <div className="sea-subcategory-panel">
                                                    {cat.children.map((sub) => (
                                                        <div
                                                            key={sub.id}
                                                            className="sea-subcategory-item"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate(`/${config.routes.PRODUCT}?category=${sub.id}`);
                                                                setCategoryOpen(false);
                                                            }}
                                                        >
                                                            {sub.name}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
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