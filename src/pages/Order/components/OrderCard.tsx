import { memo, useMemo } from "react";
import { Button, Tag, Popconfirm, message } from "antd";
import {
    FileTextOutlined,
    CarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    ReloadOutlined,
    StarOutlined,
} from "@ant-design/icons";
import type { ApiOrder } from "../types";
import { parseOrderItemImage } from "../types";

interface OrderCardProps {
    order: ApiOrder;
    onViewDetail: (order: ApiOrder) => void;
    onReOrder: (order: ApiOrder) => void;
    onCancelOrder: (orderId: number) => void;
    formatCurrency: (amount: number) => string;
}

function OrderCardComponent({
    order,
    onViewDetail,
    onReOrder,
    onCancelOrder,
    formatCurrency,
}: OrderCardProps) {
    const orderTotal = useMemo(() => {
        if (!order.items || order.items.length === 0) return 0;
        return order.items.reduce((sum, item) => {
            const p = typeof item.price === "string" ? parseFloat(item.price) || 0 : item.price;
            return sum + p * item.quantity;
        }, 0);
    }, [order.items]);

    const renderStatusTag = (status: string) => {
        const s = status ? status.toUpperCase() : "PROCESSING";
        switch (s) {
            case "SHIPPED":
                return (
                    <Tag icon={<CarOutlined />} color="processing">
                        Đang giao hàng
                    </Tag>
                );
            case "DELIVERED":
                return (
                    <Tag icon={<CheckCircleOutlined />} color="success">
                        Đã giao hàng
                    </Tag>
                );
            case "PROCESSING":
            case "PENDING":
                return (
                    <Tag icon={<ClockCircleOutlined />} color="warning">
                        Chờ xử lý
                    </Tag>
                );
            case "CANCELLED":
                return (
                    <Tag icon={<CloseCircleOutlined />} color="error">
                        Đã hủy
                    </Tag>
                );
            default:
                return <Tag color="default">{status}</Tag>;
        }
    };

    const isCancelable = order.status?.toUpperCase() === "PROCESSING" || order.status?.toUpperCase() === "PENDING";
    const isDelivered = order.status?.toUpperCase() === "DELIVERED";

    return (
        <div className="order-card">
            {/* Card Header */}
            <div className="order-card-header">
                <div className="order-meta-info">
                    <span className="order-id">
                        <FileTextOutlined style={{ marginRight: 6, color: "#c89968" }} />
                        #{order.orderCode || order.id}
                    </span>
                    <span className="order-date">
                        Đặt ngày: {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </span>
                </div>
                <div>{renderStatusTag(order.status)}</div>
            </div>

            {/* Products inside order */}
            <div className="order-products-list">
                {order.items?.map((item) => {
                    const pPrice = typeof item.price === "string" ? parseFloat(item.price) || 0 : item.price;
                    const imgUrl = parseOrderItemImage(item);

                    return (
                        <div className="order-product-item" key={item.id}>
                            <img src={imgUrl} alt={item.productName} className="order-product-img" />
                            <div className="order-product-info">
                                <div className="order-product-name">{item.productName}</div>
                                <div className="order-product-variant">{item.variantSku || "Mặc định"}</div>
                                <div className="order-product-qty">x{item.quantity}</div>
                            </div>
                            <div className="order-product-price">{formatCurrency(pPrice)}</div>
                        </div>
                    );
                })}
            </div>

            {/* Card Footer */}
            <div className="order-card-footer">
                <div className="order-total-group">
                    <span className="order-total-label">Tổng thanh toán:</span>
                    <span className="order-total-amount">{formatCurrency(orderTotal)}</span>
                </div>

                <div className="order-actions-group">
                    <Button onClick={() => onViewDetail(order)}>
                        Xem chi tiết
                    </Button>

                    <Button
                        type="primary"
                        className="order-btn-primary"
                        icon={<ReloadOutlined />}
                        onClick={() => onReOrder(order)}
                    >
                        Mua lại
                    </Button>

                    {isDelivered && (
                        <Button
                            icon={<StarOutlined style={{ color: "#faad14" }} />}
                            onClick={() => message.success("Cảm ơn bạn! Đã mở giao diện đánh giá sản phẩm.")}
                        >
                            Đánh giá
                        </Button>
                    )}

                    {isCancelable && (
                        <Popconfirm
                            title="Hủy đơn hàng này?"
                            description="Bạn có chắc chắn muốn hủy đơn hàng?"
                            onConfirm={() => onCancelOrder(order.id)}
                            okText="Đồng ý hủy"
                            cancelText="Quay lại"
                            okButtonProps={{ danger: true }}
                        >
                            <Button danger>Hủy đơn</Button>
                        </Popconfirm>
                    )}
                </div>
            </div>
        </div>
    );
}

export default memo(OrderCardComponent);
