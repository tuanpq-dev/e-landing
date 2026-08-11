import React from "react";
import { RightOutlined } from "@ant-design/icons";
import { homeCategories as categories } from "../homeData";

export const CategoryGrid: React.FC = () => {
    return (
        <section className="home-categories" aria-label="Danh mục sản phẩm">
            <div className="home-section-header">
                <h2 className="home-section-title">Danh Mục Nổi Bật</h2>
                <a href="/product" className="home-section-link">
                    Xem tất cả <RightOutlined style={{ fontSize: 11 }} />
                </a>
            </div>
            <div className="home-category-grid">
                {categories.map((cat) => (
                    <a
                        key={cat.id}
                        id={`category-${cat.id}`}
                        href={cat.href}
                        className="home-category-card"
                        aria-label={cat.label}
                    >
                        <img
                            className="home-category-img"
                            src={cat.img}
                            alt={cat.label}
                            loading="lazy"
                        />
                        <div className="home-category-label">{cat.label}</div>
                    </a>
                ))}
            </div>
        </section>
    );
};

export default CategoryGrid;
