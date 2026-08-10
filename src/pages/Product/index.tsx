import { useState, useEffect } from "react";
import { DownOutlined, RightOutlined, StarFilled, LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { useNavigate } from "react-router";
import "./Product.css";
import { colors, priceRanges, sizes } from "./productFilterConfig";
import config from "../../config/config";
import { URL } from "../../config/apiUrl";
import axiosClient from "../../api/axiosClient";

export type ApiProduct = {
    id: number;
    sku: string;
    name: string;
    basePrice: string | number;
    description: string;
    image?: string;
    status: string;
    options?: any;
    categoryId: number;
    category?: {
        id: number;
        name: string;
        slug: string;
    };
    variants?: Array<{
        id: number;
        sku: string;
        stock: number;
        price: string | number;
        image?: string | null;
        attributes?: any;
    }>;
    createdAt?: string;
};

export type CategoryItem = {
    id: number;
    name: string;
    children?: CategoryItem[];
};

export function parseProductImage(imageStr?: string, idSeed: number | string = 1): string {
    if (imageStr) {
        try {
            if (imageStr.trim().startsWith("[")) {
                const arr = JSON.parse(imageStr);
                if (Array.isArray(arr) && arr.length > 0 && arr[0]) {
                    return arr[0];
                }
            } else if (imageStr.trim().startsWith("http")) {
                return imageStr.trim();
            }
        } catch {
            if (imageStr.startsWith("http")) return imageStr;
        }
    }
    return `https://picsum.photos/seed/${idSeed}/400/300`;
}

function FilterBlock({
    title,
    children,
    defaultOpen = true,
}: {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="filter-block">
            <div className="filter-block-title" onClick={() => setOpen((v) => !v)}>
                <span>{title}</span>
                <DownOutlined className={`filter-block-title-icon${open ? " open" : ""}`} />
            </div>
            <div className={`filter-block-body${open ? "" : " collapsed"}`}>
                {children}
            </div>
        </div>
    );
}

function ProductSidebar({
    categoriesList,
    activeCategory,
    onCategoryChange,
}: {
    categoriesList: Array<{ id: number | string; label: string }>;
    activeCategory: number | string;
    onCategoryChange: (id: number | string) => void;
}) {
    const [checkedPrices, setCheckedPrices] = useState<string[]>([]);
    const [activeColors, setActiveColors] = useState<string[]>([]);
    const [activeSizes, setActiveSizes] = useState<string[]>([]);

    const togglePrice = (id: string) =>
        setCheckedPrices((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );

    const toggleColor = (id: string) =>
        setActiveColors((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        );

    const toggleSize = (s: string) =>
        setActiveSizes((prev) =>
            prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
        );

    const resetAll = () => {
        setCheckedPrices([]);
        setActiveColors([]);
        setActiveSizes([]);
        onCategoryChange("all");
    };

    const hasFilter =
        checkedPrices.length > 0 ||
        activeColors.length > 0 ||
        activeSizes.length > 0 ||
        activeCategory !== "all";

    return (
        <aside className="product-sidebar">
            <FilterBlock title="Danh Mục Sản Phẩm">
                <ul className="filter-category-list">
                    <li
                        key="all"
                        className={`filter-category-item${activeCategory === "all" ? " active" : ""}`}
                        onClick={() => onCategoryChange("all")}
                    >
                        <span>
                            {activeCategory === "all" && (
                                <RightOutlined style={{ fontSize: 10, marginRight: 6 }} />
                            )}
                            Tất cả sản phẩm
                        </span>
                    </li>
                    {categoriesList.map((cat) => (
                        <li
                            key={cat.id}
                            className={`filter-category-item${activeCategory === cat.id ? " active" : ""}`}
                            onClick={() => onCategoryChange(cat.id)}
                        >
                            <span>
                                {activeCategory === cat.id && (
                                    <RightOutlined style={{ fontSize: 10, marginRight: 6 }} />
                                )}
                                {cat.label}
                            </span>
                        </li>
                    ))}
                </ul>
            </FilterBlock>

            <FilterBlock title="Mức Giá">
                <ul className="filter-check-list">
                    {priceRanges.map((p) => (
                        <li
                            key={p.id}
                            className="filter-check-item"
                            onClick={() => togglePrice(p.id)}
                        >
                            <input
                                id={`price-${p.id}`}
                                type="checkbox"
                                className="filter-check-input"
                                checked={checkedPrices.includes(p.id)}
                                onChange={() => togglePrice(p.id)}
                            />
                            <label htmlFor={`price-${p.id}`} style={{ cursor: "pointer" }}>
                                {p.label}
                            </label>
                        </li>
                    ))}
                </ul>
            </FilterBlock>

            <FilterBlock title="Màu Sắc">
                <div className="filter-color-grid">
                    {colors.map((c) => (
                        <div
                            key={c.id}
                            id={`color-${c.id}`}
                            className={`filter-color-swatch${activeColors.includes(c.id) ? " active" : ""}`}
                            data-color={c.id}
                            title={c.label}
                            style={{ background: c.hex }}
                            onClick={() => toggleColor(c.id)}
                            role="checkbox"
                            aria-checked={activeColors.includes(c.id)}
                            aria-label={c.label}
                        />
                    ))}
                </div>
            </FilterBlock>

            <FilterBlock title="Kích Cỡ">
                <div className="filter-size-grid">
                    {sizes.map((s) => (
                        <button
                            key={s}
                            id={`size-${s}`}
                            className={`filter-size-btn${activeSizes.includes(s) ? " active" : ""}`}
                            onClick={() => toggleSize(s)}
                            aria-pressed={activeSizes.includes(s)}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </FilterBlock>

            {hasFilter && (
                <button
                    id="filter-reset"
                    className="filter-reset-btn"
                    onClick={resetAll}
                >
                    Xóa bộ lọc
                </button>
            )}
        </aside>
    );
}

function formatPrice(n: number | string) {
    const num = typeof n === "string" ? parseFloat(n) || 0 : n;
    return num.toLocaleString('vi-VN') + 'đ';
}

function ProductCard({ product, onDetail }: { product: ApiProduct; onDetail: (id: number) => void }) {
    const mainImage = parseProductImage(product.image, product.id);
    const priceNum = typeof product.basePrice === "string" ? parseFloat(product.basePrice) || 0 : product.basePrice;
    const originalPrice = Math.round(priceNum * 1.15); // Default display original price slightly higher
    const totalStock = product.variants && product.variants.length > 0
        ? product.variants.reduce((acc, v) => acc + (v.stock || 0), 0)
        : 50;

    return (
        <div className="product-card">
            <div className="product-card-image-wrap">
                <img
                    draggable={false}
                    alt={product.name}
                    src={mainImage}
                    className="product-card-img"
                />
                <span className="product-card-badge">Mới</span>
                <span className="product-card-discount">-10%</span>
                <div className="product-card-overlay">
                    <button className="product-card-btn" onClick={() => onDetail(product.id)}>Xem chi tiết</button>
                </div>
            </div>
            <div className="product-card-body">
                <div className="product-card-category">{product.category?.name || "Thời trang"}</div>
                <div className="product-card-title">{product.name}</div>
                <div className="product-card-rating">
                    <StarFilled className="product-card-star" />
                    <span className="product-card-rating-value">4.8</span>
                    <span className="product-card-review-count">(12 đánh giá)</span>
                </div>
                <div className="product-card-price-row">
                    <span className="product-card-price">{formatPrice(priceNum)}</span>
                    <span className="product-card-original-price">{formatPrice(originalPrice)}</span>
                </div>

                <div className="product-card-stock">
                    {totalStock <= 20
                        ? <span className="product-card-stock-low">Còn {totalStock} sản phẩm</span>
                        : <span className="product-card-stock-ok">Còn hàng</span>
                    }
                </div>
            </div>
        </div>
    );
}

function ProductGrid({ products, onDetail }: { products: ApiProduct[]; onDetail: (id: number) => void }) {
    if (products.length === 0) {
        return (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#888", width: "100%" }}>
                Không tìm thấy sản phẩm nào phù hợp.
            </div>
        );
    }

    return (
        <div className="product-grid">
            {products.map((p) => (
                <ProductCard key={p.id} product={p} onDetail={onDetail} />
            ))}
        </div>
    );
}

function Product() {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState<number | string>("all");
    const [productsList, setProductsList] = useState<ApiProduct[]>([]);
    const [categoriesList, setCategoriesList] = useState<Array<{ id: number; label: string }>>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Fetch Products from API
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res: any = await axiosClient.post(`${URL}/product/search`, {
                    page: 1,
                    pageSize: 50,
                });
                if (res && res.data) {
                    setProductsList(res.data);
                }
            } catch (err) {
                console.error("Fetch products error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Fetch Categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res: any = await axiosClient.post(`${URL}/category/search`, {});
                if (res && res.data) {
                    const flatCats: Array<{ id: number; label: string }> = [];
                    res.data.forEach((cat: CategoryItem) => {
                        flatCats.push({ id: cat.id, label: cat.name });
                        if (cat.children && cat.children.length > 0) {
                            cat.children.forEach((subCat) => {
                                flatCats.push({ id: subCat.id, label: subCat.name });
                            });
                        }
                    });
                    setCategoriesList(flatCats);
                }
            } catch (err) {
                console.error("Fetch categories error:", err);
            }
        };

        fetchCategories();
    }, []);

    const filtered = activeCategory === "all"
        ? productsList
        : productsList.filter((p) => p.categoryId === Number(activeCategory) || p.category?.id === Number(activeCategory));

    const handleDetail = (id: number) => {
        navigate(config.routes.PRODUCT_DETAIL(String(id)));
    };

    return (
        <div className="product-page">
            <ProductSidebar
                categoriesList={categoriesList}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
            />
            <div className="product-content">
                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 36, color: "#c89968" }} spin />} />
                    </div>
                ) : (
                    <ProductGrid products={filtered} onDetail={handleDetail} />
                )}
            </div>
        </div>
    );
}

export default Product;