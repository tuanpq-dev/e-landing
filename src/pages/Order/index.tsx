import { useState } from "react";
import {
    Breadcrumb,
    Tabs,
    Input,
    Button,
    Tag,
    Modal,
    Steps,
    Popconfirm,
    message,
} from "antd";
import {
    SearchOutlined,
    FileTextOutlined,
    CarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    ReloadOutlined,
    StarOutlined,
    EnvironmentOutlined,
    CreditCardOutlined,
    ShoppingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import config from "../../config/config";
import "./Order.css";

export interface OrderProduct {
    id: number;
    name: string;
    variant: string;
    price: number;
    quantity: number;
    image: string;
}

export interface OrderData {
    id: string;
    date: string;
    status: "pending" | "shipping" | "delivered" | "cancelled";
    products: OrderProduct[];
    recipientName: string;
    recipientPhone: string;
    recipientAddress: string;
    paymentMethod: string;
    shippingFee: number;
    discountAmount: number;
}

const initialOrders: OrderData[] = [
    {
        id: "ORD-2026-8801",
        date: "08/08/2026 14:30",
        status: "shipping",
        recipientName: "Nguyễn Văn Anh",
        recipientPhone: "0912345678",
        recipientAddress: "Số 18, Ngõ 45, Đường Lê Văn Lương, Phường Nhân Chính, Quận Thanh Xuân, Hà Nội",
        paymentMethod: "Thanh toán khi nhận hàng (COD)",
        shippingFee: 30000,
        discountAmount: 100000,
        products: [
            {
                id: 101,
                name: "Áo Polo Nam Premium Cotton Cao Cấp",
                variant: "Màu Trắng / Size L",
                price: 350000,
                quantity: 2,
                image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=150&q=80",
            },
            {
                id: 102,
                name: "Quần Jeans Slim-Fit Co Giãn Thời Trang",
                variant: "Màu Xanh Đen / Size 31",
                price: 580000,
                quantity: 1,
                image: "https://images.unsplash.com/photo-1542272604-780c36856d60?auto=format&fit=crop&w=150&q=80",
            },
        ],
    },
    {
        id: "ORD-2026-7512",
        date: "25/07/2026 09:15",
        status: "delivered",
        recipientName: "Nguyễn Văn Anh",
        recipientPhone: "0912345678",
        recipientAddress: "Số 18, Ngõ 45, Đường Lê Văn Lương, Phường Nhân Chính, Quận Thanh Xuân, Hà Nội",
        paymentMethod: "Ví điện tử MoMo",
        shippingFee: 0,
        discountAmount: 50000,
        products: [
            {
                id: 103,
                name: "Áo Khoác Blazer Nam Form Rộng Hàn Quốc",
                variant: "Màu Be / Size XL",
                price: 890000,
                quantity: 1,
                image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=150&q=80",
            },
        ],
    },
    {
        id: "ORD-2026-6109",
        date: "10/07/2026 16:45",
        status: "delivered",
        recipientName: "Nguyễn Văn Anh (Văn phòng)",
        recipientPhone: "0987654321",
        recipientAddress: "Tầng 8, Tòa nhà Landmark 72, Đường Phạm Hùng, Phường Mễ Trì, Quận Nam Từ Liêm, Hà Nội",
        paymentMethod: "Thẻ ATM / VNPAY",
        shippingFee: 30000,
        discountAmount: 0,
        products: [
            {
                id: 104,
                name: "Áo Thun Basic Oversize Unisex Premium",
                variant: "Màu Đen / Size L",
                price: 250000,
                quantity: 2,
                image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=150&q=80",
            },
        ],
    },
    {
        id: "ORD-2026-5002",
        date: "01/06/2026 11:20",
        status: "cancelled",
        recipientName: "Nguyễn Văn Anh",
        recipientPhone: "0912345678",
        recipientAddress: "Số 18, Ngõ 45, Đường Lê Văn Lương, Phường Nhân Chính, Quận Thanh Xuân, Hà Nội",
        paymentMethod: "Thanh toán khi nhận hàng (COD)",
        shippingFee: 30000,
        discountAmount: 0,
        products: [
            {
                id: 105,
                name: "Quần Short Nam Thể Thao Co Giãn 4 Chiều",
                variant: "Màu Xám / Size M",
                price: 190000,
                quantity: 1,
                image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=150&q=80",
            },
        ],
    },
];

function Order() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<OrderData[]>(initialOrders);
    const [activeStatus, setActiveStatus] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOrderDetail, setSelectedOrderDetail] = useState<OrderData | null>(null);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
    };

    // Calculate total amount for an order
    const getOrderTotal = (order: OrderData) => {
        const subtotal = order.products.reduce((sum, p) => sum + p.price * p.quantity, 0);
        return Math.max(0, subtotal - order.discountAmount + order.shippingFee);
    };

    // Filter orders
    const filteredOrders = orders.filter((order) => {
        const matchStatus = activeStatus === "all" || order.status === activeStatus;
        const matchSearch =
            searchQuery.trim() === "" ||
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.products.some((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchStatus && matchSearch;
    });

    // Re-order Action
    const handleReOrder = (order: OrderData) => {
        message.success(`Đã thêm ${order.products.length} sản phẩm từ đơn hàng ${order.id} vào giỏ hàng!`);
        navigate(`/${config.routes.CART}`);
    };

    // Cancel Order Action
    const handleCancelOrder = (orderId: string) => {
        setOrders((prev) =>
            prev.map((o) => (o.id === orderId ? { ...o, status: "cancelled" } : o))
        );
        message.success(`Đã hủy thành công đơn hàng ${orderId}`);
    };

    // Status Badge Render Helper
    const renderStatusTag = (status: OrderData["status"]) => {
        switch (status) {
            case "shipping":
                return (
                    <Tag icon={<CarOutlined />} color="processing">
                        Đang giao hàng
                    </Tag>
                );
            case "delivered":
                return (
                    <Tag icon={<CheckCircleOutlined />} color="success">
                        Đã giao hàng
                    </Tag>
                );
            case "pending":
                return (
                    <Tag icon={<ClockCircleOutlined />} color="warning">
                        Chờ xử lý
                    </Tag>
                );
            case "cancelled":
                return (
                    <Tag icon={<CloseCircleOutlined />} color="error">
                        Đã hủy
                    </Tag>
                );
        }
    };

    // Steps current index for timeline
    const getStepCurrent = (status: OrderData["status"]) => {
        switch (status) {
            case "pending":
                return 1;
            case "shipping":
                return 2;
            case "delivered":
                return 3;
            case "cancelled":
                return -1;
        }
    };

    return (
        <div className="order-page-container">
            {/* Breadcrumb Header */}
            <div className="order-header-section">
                <Breadcrumb
                    items={[
                        { title: <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Trang chủ</span> },
                        { title: "Đơn hàng của tôi" },
                    ]}
                />
                <h1 className="order-page-title">Đơn Hàng Của Tôi</h1>
            </div>

            {/* Filter Bar */}
            <div className="order-filter-bar">
                {/* Search Bar */}
                <div className="order-search-box">
                    <Input
                        prefix={<SearchOutlined style={{ color: "#9aa4b2" }} />}
                        placeholder="Tìm kiếm theo Mã đơn hàng hoặc Tên sản phẩm..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        allowClear
                        size="large"
                    />
                </div>

                {/* Status Tabs */}
                <Tabs
                    activeKey={activeStatus}
                    onChange={(key) => setActiveStatus(key)}
                    items={[
                        { key: "all", label: `Tất cả (${orders.length})` },
                        { key: "shipping", label: `Đang giao (${orders.filter((o) => o.status === "shipping").length})` },
                        { key: "delivered", label: `Đã giao (${orders.filter((o) => o.status === "delivered").length})` },
                        { key: "pending", label: `Chờ xử lý (${orders.filter((o) => o.status === "pending").length})` },
                        { key: "cancelled", label: `Đã hủy (${orders.filter((o) => o.status === "cancelled").length})` },
                    ]}
                />
            </div>

            {/* Order Cards List */}
            {filteredOrders.length > 0 ? (
                <div className="order-list">
                    {filteredOrders.map((order) => (
                        <div className="order-card" key={order.id}>
                            {/* Card Header */}
                            <div className="order-card-header">
                                <div className="order-meta-info">
                                    <span className="order-id">
                                        <FileTextOutlined style={{ marginRight: 6, color: "#c89968" }} />
                                        {order.id}
                                    </span>
                                    <span className="order-date">Đặt ngày: {order.date}</span>
                                </div>
                                <div>{renderStatusTag(order.status)}</div>
                            </div>

                            {/* Products inside order */}
                            <div className="order-products-list">
                                {order.products.map((prod) => (
                                    <div className="order-product-item" key={prod.id}>
                                        <img src={prod.image} alt={prod.name} className="order-product-img" />
                                        <div className="order-product-info">
                                            <div className="order-product-name">{prod.name}</div>
                                            <div className="order-product-variant">{prod.variant}</div>
                                            <div className="order-product-qty">x{prod.quantity}</div>
                                        </div>
                                        <div className="order-product-price">{formatCurrency(prod.price)}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Card Footer */}
                            <div className="order-card-footer">
                                <div className="order-total-group">
                                    <span className="order-total-label">Tổng thanh toán:</span>
                                    <span className="order-total-amount">{formatCurrency(getOrderTotal(order))}</span>
                                </div>

                                <div className="order-actions-group">
                                    {/* View Detail Button */}
                                    <Button onClick={() => setSelectedOrderDetail(order)}>
                                        Xem chi tiết
                                    </Button>

                                    {/* Re-order Button */}
                                    <Button
                                        type="primary"
                                        className="order-btn-primary"
                                        icon={<ReloadOutlined />}
                                        onClick={() => handleReOrder(order)}
                                    >
                                        Mua lại
                                    </Button>

                                    {/* Review Button for Delivered Orders */}
                                    {order.status === "delivered" && (
                                        <Button
                                            icon={<StarOutlined style={{ color: "#faad14" }} />}
                                            onClick={() => message.success("Cảm ơn bạn! Đã mở giao diện đánh giá sản phẩm.")}
                                        >
                                            Đánh giá
                                        </Button>
                                    )}

                                    {/* Cancel Button for Pending Orders */}
                                    {order.status === "pending" && (
                                        <Popconfirm
                                            title="Hủy đơn hàng này?"
                                            description="Bạn có chắc chắn muốn hủy đơn hàng?"
                                            onConfirm={() => handleCancelOrder(order.id)}
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
                    ))}
                </div>
            ) : (
                /* Empty Orders State */
                <div className="empty-orders-card">
                    <ShoppingOutlined className="empty-orders-icon" />
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#22242a", marginBottom: 6 }}>
                        Không tìm thấy đơn hàng nào
                    </h3>
                    <p style={{ fontSize: 13, color: "#778290", marginBottom: 20 }}>
                        Chưa có đơn hàng phù hợp với điều kiện tìm kiếm hoặc bộ lọc của bạn.
                    </p>
                    <Button
                        type="primary"
                        onClick={() => navigate(`/${config.routes.PRODUCT}`)}
                        style={{ backgroundColor: "#22242a", borderColor: "#22242a", borderRadius: 8 }}
                    >
                        Mua sắm ngay
                    </Button>
                </div>
            )}

            {/* Order Detail Modal */}
            <Modal
                title={`Chi Tiết Đơn Hàng ${selectedOrderDetail?.id || ""}`}
                open={!!selectedOrderDetail}
                onCancel={() => setSelectedOrderDetail(null)}
                footer={[
                    <Button key="close" onClick={() => setSelectedOrderDetail(null)}>
                        Đóng
                    </Button>,
                    selectedOrderDetail && (
                        <Button
                            key="reorder"
                            type="primary"
                            className="order-btn-primary"
                            icon={<ReloadOutlined />}
                            onClick={() => {
                                const order = selectedOrderDetail;
                                setSelectedOrderDetail(null);
                                handleReOrder(order);
                            }}
                        >
                            Mua lại đơn này
                        </Button>
                    ),
                ]}
                width={680}
            >
                {selectedOrderDetail && (
                    <div style={{ paddingTop: 10 }}>
                        {/* Status Timeline Steps */}
                        <div className="order-detail-section" style={{ marginBottom: 28, padding: "16px 12px", backgroundColor: "#fbfcfd", borderRadius: 10 }}>
                            {selectedOrderDetail.status === "cancelled" ? (
                                <Tag color="error" style={{ fontSize: 13, padding: "4px 12px" }}>
                                    Đơn hàng đã được hủy
                                </Tag>
                            ) : (
                                <Steps
                                    current={getStepCurrent(selectedOrderDetail.status)}
                                    size="small"
                                    items={[
                                        { title: "Đặt hàng" },
                                        { title: "Chờ xử lý" },
                                        { title: "Đang giao" },
                                        { title: "Đã giao" },
                                    ]}
                                />
                            )}
                        </div>

                        {/* Recipient Information */}
                        <div className="order-detail-section">
                            <div className="order-detail-subtitle">
                                <EnvironmentOutlined style={{ color: "#c89968" }} /> Thông tin người nhận
                            </div>
                            <div className="info-box-gray">
                                <div><strong>Họ và tên:</strong> {selectedOrderDetail.recipientName}</div>
                                <div><strong>Số điện thoại:</strong> {selectedOrderDetail.recipientPhone}</div>
                                <div><strong>Địa chỉ giao hàng:</strong> {selectedOrderDetail.recipientAddress}</div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="order-detail-section">
                            <div className="order-detail-subtitle">
                                <CreditCardOutlined style={{ color: "#c89968" }} /> Phương thức thanh toán
                            </div>
                            <div className="info-box-gray">
                                <div>{selectedOrderDetail.paymentMethod}</div>
                            </div>
                        </div>

                        {/* Products List Breakdown */}
                        <div className="order-detail-section">
                            <div className="order-detail-subtitle">Sản phẩm trong đơn hàng</div>
                            {selectedOrderDetail.products.map((prod) => (
                                <div className="order-product-item" key={prod.id} style={{ padding: "10px 0" }}>
                                    <img src={prod.image} alt={prod.name} className="order-product-img" style={{ width: 54, height: 54 }} />
                                    <div className="order-product-info">
                                        <div className="order-product-name">{prod.name}</div>
                                        <div className="order-product-variant">{prod.variant}</div>
                                        <div className="order-product-qty">x{prod.quantity}</div>
                                    </div>
                                    <div className="order-product-price">{formatCurrency(prod.price * prod.quantity)}</div>
                                </div>
                            ))}
                        </div>

                        {/* Order Cost Summary */}
                        <div style={{ borderTop: "1px dashed #e2e7ec", paddingTop: 14, fontSize: 13 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                <span>Tạm tính tiền hàng:</span>
                                <span>{formatCurrency(selectedOrderDetail.products.reduce((s, p) => s + p.price * p.quantity, 0))}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                <span>Phí vận chuyển:</span>
                                <span>{selectedOrderDetail.shippingFee === 0 ? "Miễn phí" : formatCurrency(selectedOrderDetail.shippingFee)}</span>
                            </div>
                            {selectedOrderDetail.discountAmount > 0 && (
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, color: "#52c41a" }}>
                                    <span>Giảm giá Voucher:</span>
                                    <span>-{formatCurrency(selectedOrderDetail.discountAmount)}</span>
                                </div>
                            )}
                            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid #edf0f5", fontWeight: 700, fontSize: 16 }}>
                                <span>Tổng tiền thanh toán:</span>
                                <span style={{ color: "#c89968", fontSize: 18 }}>{formatCurrency(getOrderTotal(selectedOrderDetail))}</span>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Order;
