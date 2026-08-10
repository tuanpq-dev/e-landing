import { useState } from "react";
import { useParams } from "react-router";
import { StarFilled, HeartOutlined, ShoppingCartOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { products } from "../mockProduct";
import './DetailProduct.css';

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const data = products.find((product) => String(product.id) === String(id));

    const [selectedColor, setSelectedColor] = useState<string>("");
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [qty, setQty] = useState(1);

    if (!data) {
        return (
            <div className="detail-not-found">
                <div className="detail-not-found-title">Không tìm thấy sản phẩm</div>
                <button className="detail-back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeftOutlined /> Quay lại
                </button>
            </div>
        );
    }

    const discount = Math.round((1 - data.price / data.originalPrice) * 100);

    return (
        <div className="detail-product">
            {/* Breadcrumb */}
            <div className="detail-breadcrumb">
                <span className="detail-breadcrumb-link" onClick={() => navigate(-1)}>
                    <ArrowLeftOutlined style={{ marginRight: 6 }} />
                    Sản phẩm
                </span>
                <span className="detail-breadcrumb-sep">/</span>
                <span className="detail-breadcrumb-current">{data.title}</span>
            </div>

            <div className="detail-product-body">
                {/* Left: Image */}
                <div className="detail-product-image-col">
                    <div className="detail-product-image-wrap">
                        <img
                            src={`https://picsum.photos/seed/${id}/600/600`}
                            alt={data.title}
                            className="detail-product-img"
                            draggable={false}
                        />
                        {data.isNew && <span className="detail-badge-new">Mới</span>}
                        <span className="detail-badge-discount">-{discount}%</span>
                    </div>
                    {/* Thumbnail row (same image with different seeds for demo) */}
                    <div className="detail-thumbnails">
                        {[0, 1, 2, 3].map((i) => (
                            <div key={i} className={`detail-thumbnail${i === 0 ? ' active' : ''}`}>
                                <img
                                    src={`https://picsum.photos/seed/${id}${i}/120/120`}
                                    alt=""
                                    draggable={false}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Info */}
                <div className="detail-info">
                    <div className="detail-category">{data.category}</div>
                    <h1 className="detail-title">{data.title}</h1>

                    {/* Rating */}
                    <div className="detail-rating">
                        <div className="detail-stars">
                            {[1,2,3,4,5].map((s) => (
                                <StarFilled
                                    key={s}
                                    className={`detail-star${s <= Math.round(data.rating) ? ' filled' : ''}`}
                                />
                            ))}
                        </div>
                        <span className="detail-rating-value">{data.rating}</span>
                        <span className="detail-review-count">({data.reviewCount} đánh giá)</span>
                    </div>

                    {/* Price */}
                    <div className="detail-price-row">
                        <span className="detail-price">{data.price.toLocaleString('vi-VN')}đ</span>
                        <span className="detail-original-price">{data.originalPrice.toLocaleString('vi-VN')}đ</span>
                        <span className="detail-discount-tag">-{discount}%</span>
                    </div>

                    <div className="detail-divider" />

                    {/* Description */}
                    <p className="detail-description">{data.description}</p>

                    {/* Color selector */}
                    <div className="detail-option-section">
                        <div className="detail-option-label">
                            Màu sắc: <span className="detail-option-selected">{selectedColor || "Chọn màu"}</span>
                        </div>
                        <div className="detail-color-list">
                            {data.colors.map((c) => (
                                <button
                                    key={c}
                                    className={`detail-color-btn${selectedColor === c ? ' active' : ''}`}
                                    onClick={() => setSelectedColor(c)}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Size selector */}
                    <div className="detail-option-section">
                        <div className="detail-option-label">
                            Kích cỡ: <span className="detail-option-selected">{selectedSize || "Chọn size"}</span>
                        </div>
                        <div className="detail-size-list">
                            {data.sizes.map((s) => (
                                <button
                                    key={s}
                                    className={`detail-size-btn${selectedSize === s ? ' active' : ''}`}
                                    onClick={() => setSelectedSize(s)}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quantity + Stock */}
                    <div className="detail-qty-row">
                        <div className="detail-qty-control">
                            <button className="detail-qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                            <span className="detail-qty-value">{qty}</span>
                            <button className="detail-qty-btn" onClick={() => setQty(q => Math.min(data.stock, q + 1))}>+</button>
                        </div>
                        <span className={`detail-stock${data.stock <= 20 ? ' low' : ''}`}>
                            {data.stock > 0 ? `Còn ${data.stock} sản phẩm` : 'Hết hàng'}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="detail-actions">
                        <button className="detail-btn-cart" disabled={data.stock === 0}>
                            <ShoppingCartOutlined style={{ marginRight: 8 }} />
                            Thêm vào giỏ
                        </button>
                        <button className="detail-btn-wishlist" aria-label="Yêu thích">
                            <HeartOutlined />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;