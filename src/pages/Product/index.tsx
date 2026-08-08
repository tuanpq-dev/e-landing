import { useState } from "react";
import { DownOutlined, RightOutlined, StarFilled } from "@ant-design/icons";
import "./Product.css";
import { categories, colors, priceRanges, products, sizes } from "./mockProduct";

type TypeProduct = {
    id: string;
    title: string;
    description: string;
    image?: string;
    price: number;
    originalPrice: number;
    category: string;
    rating: number;
    reviewCount: number;
    colors: string[];
    sizes: string[];
    stock: number;
    isNew: boolean;
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
    activeCategory,
    onCategoryChange,
}: {
    activeCategory: string;
    onCategoryChange: (id: string) => void;
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
                    {categories.map((cat) => (
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
                            <span className="count">({cat.count})</span>
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

function formatPrice(n: number) {
    return n.toLocaleString('vi-VN') + 'đ';
}

function ProductCard({ product }: { product: TypeProduct }) {
    const discount = Math.round((1 - product.price / product.originalPrice) * 100);
    return (
        <div className="product-card">
            <div className="product-card-image-wrap">
                <img
                    draggable={false}
                    alt={product.title}
                    src={`https://picsum.photos/seed/${product.id}/400/300`}
                    className="product-card-img"
                />
                {product.isNew && <span className="product-card-badge">Mới</span>}
                <span className="product-card-discount">-{discount}%</span>
                <div className="product-card-overlay">
                    <button className="product-card-btn">Chọn sản phẩm</button>
                </div>
            </div>
            <div className="product-card-body">
                <div className="product-card-category">{product.category}</div>
                <div className="product-card-title">{product.title}</div>
                <div className="product-card-rating">
                    <StarFilled className="product-card-star" />
                    <span className="product-card-rating-value">{product.rating}</span>
                    <span className="product-card-review-count">({product.reviewCount} đánh giá)</span>
                </div>
                <div className="product-card-price-row">
                    <span className="product-card-price">{formatPrice(product.price)}</span>
                    <span className="product-card-original-price">{formatPrice(product.originalPrice)}</span>
                </div>

                <div className="product-card-stock">
                    {product.stock <= 20
                        ? <span className="product-card-stock-low">Còn {product.stock} sản phẩm</span>
                        : <span className="product-card-stock-ok">Còn hàng</span>
                    }
                </div>
            </div>
        </div>
    );
}

function ProductGrid({ products }: { products: TypeProduct[] }) {
    return (
        <div className="product-grid">
            {products.map((p) => (
                <ProductCard key={p.id} product={p} />
            ))}
        </div>
    );
}

function Product() {
    const [activeCategory, setActiveCategory] = useState("all");

    const filtered =
        activeCategory === "all"
            ? products
            : products.filter((p: any) => p.category === activeCategory);

    return (
        <div className="product-page">
            <ProductSidebar
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
            />
            <div className="product-content">
                <ProductGrid products={filtered} />
            </div>
        </div>
    );
}

export default Product;