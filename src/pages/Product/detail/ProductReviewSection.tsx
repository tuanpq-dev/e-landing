import { useState, useEffect } from "react";
import { message, Spin } from "antd";
import axiosClient from "../../../api/axiosClient";
import { URL } from "../../../config/apiUrl";

import type { ReviewData, ReplyItem } from "./components/types";
import { ReviewSummary } from "./components/ReviewSummary";
import { ReviewFilterTabs } from "./components/ReviewFilterTabs";
import { ReviewItemCard } from "./components/ReviewItemCard";
import "./ProductReviewSection.css";

export type { ReviewData, ReplyItem };

interface ProductReviewSectionProps {
    productId?: number | string;
}

export function ProductReviewSection({ productId }: ProductReviewSectionProps) {
    const [reviews, setReviews] = useState<ReviewData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [activeFilter, setActiveFilter] = useState<string>("all");
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // Fetch review list from API
    useEffect(() => {
        const fetchReviews = async () => {
            if (!productId) return;
            setLoading(true);
            try {
                const res: any = await axiosClient.get(`${URL}/review/${productId}`);
                const rawList = Array.isArray(res) ? res : res?.data || [];
                if (Array.isArray(rawList)) {
                    const mapped: ReviewData[] = rawList.map((item: any) => ({
                        id: item.id,
                        userName:
                            item.user?.fullname ||
                            item.user?.name ||
                            item.user?.email?.split("@")[0] ||
                            `Khách hàng #${item.userId || item.id}`,
                        userAvatar: item.user?.avatar || "",
                        isVerified: true,
                        rating: item.rating || 5,
                        createdAt: item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString("vi-VN", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                              })
                            : "Mới đây",
                        variantInfo: "",
                        content: item.content || "Người dùng không để lại bình luận.",
                        images: item.images || [],
                        likesCount: item.likesCount || 0,
                        heartsCount: item.heartsCount || 0,
                        userReaction: null,
                        replies: item.reply
                            ? [
                                  {
                                      id: item.id * 1000 + 1,
                                      userName: "Thời Trang Nam Store (Shop)",
                                      isSeller: true,
                                      createdAt: item.updatedAt
                                          ? new Date(item.updatedAt).toLocaleDateString("vi-VN")
                                          : "Mới đây",
                                      content: item.reply,
                                      likesCount: 0,
                                      isLiked: false,
                                  },
                              ]
                            : [],
                    }));
                    setReviews(mapped);
                }
            } catch (err) {
                console.error("Fetch reviews error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [productId]);

    // Handle like / heart reactions toggle
    const handleToggleReaction = (reviewId: number, type: "like" | "heart") => {
        setReviews((prev) =>
            prev.map((item) => {
                if (item.id !== reviewId) return item;

                let newLikes = item.likesCount;
                let newHearts = item.heartsCount;
                let newReaction: "like" | "heart" | null = type;

                if (item.userReaction === type) {
                    newReaction = null;
                    if (type === "like") newLikes = Math.max(0, newLikes - 1);
                    if (type === "heart") newHearts = Math.max(0, newHearts - 1);
                } else {
                    if (item.userReaction === "like") newLikes = Math.max(0, newLikes - 1);
                    if (item.userReaction === "heart") newHearts = Math.max(0, newHearts - 1);

                    if (type === "like") newLikes += 1;
                    if (type === "heart") newHearts += 1;
                }

                return {
                    ...item,
                    likesCount: newLikes,
                    heartsCount: newHearts,
                    userReaction: newReaction,
                };
            })
        );
    };

    // Handle submitting reply
    const handleSubmitReply = (reviewId: number, replyContent: string) => {
        const newReply: ReplyItem = {
            id: Date.now(),
            userName: "Tôi",
            createdAt: "Vừa xong",
            content: replyContent,
            likesCount: 0,
            isLiked: false,
        };

        setReviews((prev) =>
            prev.map((item) => {
                if (item.id === reviewId) {
                    return {
                        ...item,
                        replies: [...item.replies, newReply],
                    };
                }
                return item;
            })
        );

        message.success("Đã gửi phản hồi!");
    };

    // Handle toggling like on a reply
    const handleToggleReplyLike = (reviewId: number, replyId: number) => {
        setReviews((prev) =>
            prev.map((item) => {
                if (item.id !== reviewId) return item;

                return {
                    ...item,
                    replies: item.replies.map((reply) => {
                        if (reply.id !== replyId) return reply;
                        const isLiked = !reply.isLiked;
                        return {
                            ...reply,
                            isLiked,
                            likesCount: isLiked ? reply.likesCount + 1 : Math.max(0, reply.likesCount - 1),
                        };
                    }),
                };
            })
        );
    };

    // Filter reviews list
    const filteredReviews = reviews.filter((r) => {
        if (activeFilter === "5star") return r.rating === 5;
        if (activeFilter === "4star") return r.rating === 4;
        if (activeFilter === "3star") return r.rating === 3;
        return true;
    });

    // Rating calculations
    const totalReviews = reviews.length;
    const averageRating =
        totalReviews > 0
            ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
            : 5.0;

    const count5 = reviews.filter((r) => r.rating === 5).length;
    const count4 = reviews.filter((r) => r.rating === 4).length;
    const count3 = reviews.filter((r) => r.rating === 3).length;
    const count2 = reviews.filter((r) => r.rating === 2).length;
    const count1 = reviews.filter((r) => r.rating === 1).length;

    const percent5 = totalReviews > 0 ? Math.round((count5 / totalReviews) * 100) : 0;
    const percent4 = totalReviews > 0 ? Math.round((count4 / totalReviews) * 100) : 0;
    const percent3 = totalReviews > 0 ? Math.round((count3 / totalReviews) * 100) : 0;
    const percent2 = totalReviews > 0 ? Math.round((count2 / totalReviews) * 100) : 0;
    const percent1 = totalReviews > 0 ? Math.round((count1 / totalReviews) * 100) : 0;

    return (
        <div className="review-section">
            <div className="review-section-header">
                <h3 className="review-section-title">Đánh Giá & Nhận Xét Sản Phẩm</h3>
            </div>

            {/* Summary Rating Box Component */}
            <ReviewSummary
                averageRating={averageRating}
                totalReviews={totalReviews}
                percent5={percent5}
                percent4={percent4}
                percent3={percent3}
                percent2={percent2}
                percent1={percent1}
            />

            {/* Filter Tabs Component */}
            <ReviewFilterTabs
                activeFilter={activeFilter}
                onSelectFilter={setActiveFilter}
                totalCount={totalReviews}
                count5={count5}
                count4={count4}
                count3={count3}
            />

            {/* Review Cards List */}
            {loading ? (
                <div className="review-empty-state">
                    <Spin />
                </div>
            ) : (
                <div className="review-list">
                    {filteredReviews.length === 0 ? (
                        <div className="review-empty-state">
                            Chưa có đánh giá nào cho sản phẩm này.
                        </div>
                    ) : (
                        filteredReviews.map((rev) => (
                            <ReviewItemCard
                                key={rev.id}
                                review={rev}
                                onToggleReaction={handleToggleReaction}
                                onSubmitReply={handleSubmitReply}
                                onToggleReplyLike={handleToggleReplyLike}
                                onPreviewImage={setPreviewImage}
                            />
                        ))
                    )}
                </div>
            )}

            {/* Image Modal Lightbox */}
            {previewImage && (
                <div className="review-img-modal-overlay" onClick={() => setPreviewImage(null)}>
                    <div className="review-img-modal-content" onClick={(e) => e.stopPropagation()}>
                        <img src={previewImage} alt="Preview" />
                        <button className="review-img-modal-close" onClick={() => setPreviewImage(null)}>
                            ×
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductReviewSection;
