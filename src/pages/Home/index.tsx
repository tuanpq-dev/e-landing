import { useNavigate } from "react-router";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import "./Home.css";
import { categories, slides } from "./mockHome";
import useCarousel from "../../hooks/useCarousel";

function HeroDots({
    current,
    onGoTo,
}: {
    current: number;
    onGoTo: (i: number) => void;
}) {
    return (
        <div className="hero-dots" role="tablist">
            {slides.map((_, i) => (
                <button
                    key={i}
                    role="tab"
                    aria-selected={current - 1 === i}
                    className={`hero-dot${current - 1 === i ? " active" : ""}`}
                    onClick={() => onGoTo(i)}
                    aria-label={`Chuyển đến slide ${i + 1}`}
                />
            ))}
        </div>
    );
}

function CategoryGrid() {
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
}

function Home() {
    const navigate = useNavigate();
    const { current, transition, go, goTo, handleTransitionEnd, loop } =
        useCarousel();

    return (
        <main>
            <section className="hero-banner" aria-label="Ảnh nổi bật">
                <div
                    className="hero-slides"
                    onTransitionEnd={handleTransitionEnd}
                    style={{
                        transform: `translateX(-${current * 100}%)`,
                        transition: transition ? "transform .6s ease" : "none",
                    }}
                >
                    {loop.map((slide, i) => (
                        <div className="hero-slide" key={i}>
                            <img
                                className="hero-slide-img"
                                src={slide.img}
                                alt={slide.label}
                                loading={i === 1 ? "eager" : "lazy"}
                            />
                            <div className={slide.overlayClass} />
                            <div className={`hero-copy ${slide.copyAlign}`}>
                                <div className="hero-label">{slide.label}</div>
                                <h1 className="hero-title">
                                    {slide.title.split("\n").map((line, j) => (
                                        <span key={j}>
                                            {line}
                                            <br />
                                        </span>
                                    ))}
                                </h1>
                                <p className="hero-sub">{slide.sub}</p>
                                <button
                                    className={`hero-cta${slide.ctaStyle === "dark" ? " dark" : ""}`}
                                    onClick={() => navigate(slide.href)}
                                >
                                    {slide.cta}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    className="hero-arrow prev"
                    onClick={() => go(-1)}
                    aria-label="Slide trước"
                >
                    <LeftOutlined />
                </button>

                <button
                    className="hero-arrow next"
                    onClick={() => go(1)}
                    aria-label="Slide tiếp theo"
                >
                    <RightOutlined />
                </button>

                <HeroDots current={current} onGoTo={goTo} />
            </section>

            <CategoryGrid />
        </main>
    );
}

export default Home;