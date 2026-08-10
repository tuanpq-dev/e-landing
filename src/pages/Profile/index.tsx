import { useState } from "react";
import {
    Breadcrumb,
    Form,
    Input,
    Button,
    Radio,
    DatePicker,
    Avatar,
    Tag,
    Modal,
    Popconfirm,
    message,
} from "antd";
import {
    UserOutlined,
    LockOutlined,
    EnvironmentOutlined,
    ShoppingOutlined,
    LogoutOutlined,
    CameraOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    CrownOutlined,
    PhoneOutlined,
    MailOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CarOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import config from "../../config/config";
import "./Profile.css";

// Interface definitions
interface UserProfileData {
    fullName: string;
    email: string;
    phone: string;
    gender: "male" | "female" | "other";
    dob?: dayjs.Dayjs;
    avatar: string;
}

interface AddressItem {
    id: number;
    name: string;
    phone: string;
    address: string;
    isDefault: boolean;
}

interface OrderItem {
    id: string;
    date: string;
    total: number;
    itemsCount: number;
    status: "delivered" | "shipping" | "pending" | "cancelled";
}

const mockUserData: UserProfileData = {
    fullName: "Nguyễn Văn Anh",
    email: "nguyen.van.anh@gmail.com",
    phone: "0912345678",
    gender: "male",
    dob: dayjs("1995-08-15"),
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
};

const mockAddresses: AddressItem[] = [
    {
        id: 1,
        name: "Nguyễn Văn Anh",
        phone: "0912345678",
        address: "Số 18, Ngõ 45, Đường Lê Văn Lương, Phường Nhân Chính, Quận Thanh Xuân, Hà Nội",
        isDefault: true,
    },
    {
        id: 2,
        name: "Nguyễn Văn Anh (Văn phòng)",
        phone: "0987654321",
        address: "Tầng 8, Tòa nhà Landmark 72, Đường Phạm Hùng, Phường Mễ Trì, Quận Nam Từ Liêm, Hà Nội",
        isDefault: false,
    },
];

const mockOrders: OrderItem[] = [
    {
        id: "ORD-2026-8801",
        date: "08/08/2026",
        total: 1280000,
        itemsCount: 3,
        status: "shipping",
    },
    {
        id: "ORD-2026-7512",
        date: "25/07/2026",
        total: 930000,
        itemsCount: 2,
        status: "delivered",
    },
    {
        id: "ORD-2026-6109",
        date: "10/07/2026",
        total: 450000,
        itemsCount: 1,
        status: "delivered",
    },
];

function Profile() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"info" | "password" | "address" | "orders">("info");
    const [profileData, setProfileData] = useState<UserProfileData>(mockUserData);
    const [addresses, setAddresses] = useState<AddressItem[]>(mockAddresses);
    const [saving, setSaving] = useState(false);

    // Modal state for Address
    const [addressModalVisible, setAddressModalVisible] = useState(false);
    const [editingAddress, setEditingAddress] = useState<AddressItem | null>(null);
    const [addressForm] = Form.useForm();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
    };

    // Save Personal Profile Info
    const handleSaveProfile = (values: Partial<UserProfileData>) => {
        setSaving(true);
        setTimeout(() => {
            setProfileData((prev) => ({ ...prev, ...values }));
            setSaving(false);
            message.success("Cập nhật thông tin tài khoản thành công!");
        }, 800);
    };

    // Save Change Password
    const handleChangePassword = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            message.success("Đổi mật khẩu thành công! Vui lòng nhớ mật khẩu mới của bạn.");
        }, 1000);
    };

    // Open Modal for Add/Edit Address
    const handleOpenAddressModal = (item?: AddressItem) => {
        if (item) {
            setEditingAddress(item);
            addressForm.setFieldsValue(item);
        } else {
            setEditingAddress(null);
            addressForm.resetFields();
        }
        setAddressModalVisible(true);
    };

    // Save Address
    const handleSaveAddress = async () => {
        try {
            const values = await addressForm.validateFields();
            if (editingAddress) {
                setAddresses((prev) =>
                    prev.map((addr) => (addr.id === editingAddress.id ? { ...addr, ...values } : addr))
                );
                message.success("Cập nhật địa chỉ thành công!");
            } else {
                const newAddr: AddressItem = {
                    id: Date.now(),
                    ...values,
                    isDefault: addresses.length === 0,
                };
                setAddresses((prev) => [...prev, newAddr]);
                message.success("Thêm địa chỉ mới thành công!");
            }
            setAddressModalVisible(false);
        } catch {
            // Validation failed
        }
    };

    // Set Default Address
    const handleSetDefaultAddress = (id: number) => {
        setAddresses((prev) =>
            prev.map((addr) => ({ ...addr, isDefault: addr.id === id }))
        );
        message.success("Đã đặt làm địa chỉ giao hàng mặc định");
    };

    // Delete Address
    const handleDeleteAddress = (id: number) => {
        setAddresses((prev) => prev.filter((addr) => addr.id !== id));
        message.success("Đã xóa địa chỉ thành công");
    };

    // Logout
    const handleLogout = () => {
        message.info("Đã đăng xuất khỏi tài khoản");
        navigate(`/${config.routes.LOGIN}`);
    };

    return (
        <div className="profile-page-container">
            {/* Breadcrumb */}
            <Breadcrumb
                items={[
                    { title: <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Trang chủ</span> },
                    { title: "Tài khoản của tôi" },
                ]}
            />

            {/* Profile Grid Layout */}
            <div className="profile-layout">
                {/* Left Sidebar */}
                <div className="profile-sidebar">
                    <div className="user-profile-header">
                        <div className="avatar-wrapper">
                            <Avatar size={76} src={profileData.avatar} icon={<UserOutlined />} />
                            <div
                                className="avatar-upload-badge"
                                onClick={() => message.info("Chức năng tải ảnh đại diện đang phát triển")}
                            >
                                <CameraOutlined />
                            </div>
                        </div>
                        <div className="user-display-name">{profileData.fullName}</div>
                        <div className="user-display-email">{profileData.email}</div>
                        <div className="user-membership-badge">
                            <CrownOutlined />
                            <span>Thành viên VIP</span>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <div className="profile-menu-list">
                        <div
                            className={`profile-menu-item ${activeTab === "info" ? "active" : ""}`}
                            onClick={() => setActiveTab("info")}
                        >
                            <UserOutlined className="menu-icon" />
                            <span>Thông tin cá nhân</span>
                        </div>

                        <div
                            className={`profile-menu-item ${activeTab === "password" ? "active" : ""}`}
                            onClick={() => setActiveTab("password")}
                        >
                            <LockOutlined className="menu-icon" />
                            <span>Đổi mật khẩu</span>
                        </div>

                        <div
                            className={`profile-menu-item ${activeTab === "address" ? "active" : ""}`}
                            onClick={() => setActiveTab("address")}
                        >
                            <EnvironmentOutlined className="menu-icon" />
                            <span>Sổ địa chỉ ({addresses.length})</span>
                        </div>

                        <div
                            className={`profile-menu-item ${activeTab === "orders" ? "active" : ""}`}
                            onClick={() => setActiveTab("orders")}
                        >
                            <ShoppingOutlined className="menu-icon" />
                            <span>Đơn hàng của tôi</span>
                        </div>

                        <Popconfirm
                            title="Đăng xuất tài khoản?"
                            description="Bạn có chắc chắn muốn đăng xuất không?"
                            onConfirm={handleLogout}
                            okText="Đăng xuất"
                            cancelText="Hủy"
                        >
                            <div className="profile-menu-item" style={{ color: "#ff4d4f" }}>
                                <LogoutOutlined className="menu-icon" style={{ color: "#ff4d4f" }} />
                                <span>Đăng xuất</span>
                            </div>
                        </Popconfirm>
                    </div>
                </div>

                {/* Right Main Content Panel */}
                <div className="profile-content-card">
                    {/* TAB 1: Personal Info */}
                    {activeTab === "info" && (
                        <div>
                            <div className="tab-header">
                                <h2 className="tab-title">Thông Tin Cá Nhân</h2>
                                <p className="tab-desc">Quản lý thông tin hồ sơ cá nhân để bảo vệ tài khoản</p>
                            </div>

                            <Form
                                layout="vertical"
                                className="profile-form"
                                initialValues={profileData}
                                onFinish={handleSaveProfile}
                                style={{ maxWidth: 540 }}
                            >
                                <Form.Item
                                    label="Họ và tên"
                                    name="fullName"
                                    rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
                                >
                                    <Input prefix={<UserOutlined />} size="large" />
                                </Form.Item>

                                <Form.Item label="Địa chỉ Email" name="email">
                                    <Input prefix={<MailOutlined />} size="large" disabled />
                                </Form.Item>

                                <Form.Item
                                    label="Số điện thoại"
                                    name="phone"
                                    rules={[
                                        { required: true, message: "Vui lòng nhập số điện thoại!" },
                                        { pattern: /^[0-9]{10,11}$/, message: "Số điện thoại gồm 10-11 chữ số!" }
                                    ]}
                                >
                                    <Input prefix={<PhoneOutlined />} size="large" />
                                </Form.Item>

                                <Form.Item label="Giới tính" name="gender">
                                    <Radio.Group>
                                        <Radio value="male">Nam</Radio>
                                        <Radio value="female">Nữ</Radio>
                                        <Radio value="other">Khác</Radio>
                                    </Radio.Group>
                                </Form.Item>

                                <Form.Item label="Ngày sinh" name="dob">
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        style={{ width: "100%" }}
                                        size="large"
                                        placeholder="Chọn ngày sinh"
                                    />
                                </Form.Item>

                                <Form.Item style={{ marginTop: 24 }}>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="profile-submit-btn"
                                        loading={saving}
                                    >
                                        Lưu Thay Đổi
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    )}

                    {/* TAB 2: Change Password */}
                    {activeTab === "password" && (
                        <div>
                            <div className="tab-header">
                                <h2 className="tab-title">Đổi Mật Khẩu</h2>
                                <p className="tab-desc">Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</p>
                            </div>

                            <Form
                                layout="vertical"
                                className="profile-form"
                                onFinish={handleChangePassword}
                                style={{ maxWidth: 540 }}
                            >
                                <Form.Item
                                    label="Mật khẩu hiện tại"
                                    name="currentPassword"
                                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại!" }]}
                                >
                                    <Input.Password prefix={<LockOutlined />} size="large" placeholder="••••••••" />
                                </Form.Item>

                                <Form.Item
                                    label="Mật khẩu mới"
                                    name="newPassword"
                                    rules={[
                                        { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                                        { min: 6, message: "Mật khẩu mới tối thiểu 6 ký tự!" }
                                    ]}
                                    hasFeedback
                                >
                                    <Input.Password prefix={<LockOutlined />} size="large" placeholder="Tối thiểu 6 ký tự" />
                                </Form.Item>

                                <Form.Item
                                    label="Xác nhận mật khẩu mới"
                                    name="confirmPassword"
                                    dependencies={["newPassword"]}
                                    hasFeedback
                                    rules={[
                                        { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue("newPassword") === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error("Mật khẩu mới không khớp!"));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password prefix={<LockOutlined />} size="large" placeholder="Nhập lại mật khẩu mới" />
                                </Form.Item>

                                <Form.Item style={{ marginTop: 24 }}>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="profile-submit-btn"
                                        loading={saving}
                                    >
                                        Cập Nhật Mật Khẩu
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    )}

                    {/* TAB 3: Address Book */}
                    {activeTab === "address" && (
                        <div>
                            <div className="tab-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <h2 className="tab-title">Sổ Địa Chỉ Giao Hàng</h2>
                                    <p className="tab-desc">Quản lý địa chỉ nhận hàng thuận tiện cho thanh toán</p>
                                </div>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => handleOpenAddressModal()}
                                    style={{ backgroundColor: "#22242a", borderColor: "#22242a", borderRadius: 8 }}
                                >
                                    Thêm Địa Chỉ Mới
                                </Button>
                            </div>

                            <div className="address-grid">
                                {addresses.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`address-card ${item.isDefault ? "is-default" : ""}`}
                                    >
                                        <div className="address-header">
                                            <span className="address-name">{item.name}</span>
                                            {item.isDefault && (
                                                <Tag color="gold" style={{ borderRadius: 12 }}>
                                                    Mặc định
                                                </Tag>
                                            )}
                                        </div>

                                        <div className="address-phone">SĐT: {item.phone}</div>
                                        <div className="address-detail">{item.address}</div>

                                        <div className="address-actions">
                                            <Button
                                                type="link"
                                                size="small"
                                                icon={<EditOutlined />}
                                                onClick={() => handleOpenAddressModal(item)}
                                                style={{ color: "#c89968", padding: 0 }}
                                            >
                                                Sửa
                                            </Button>

                                            {!item.isDefault && (
                                                <>
                                                    <Button
                                                        type="link"
                                                        size="small"
                                                        onClick={() => handleSetDefaultAddress(item.id)}
                                                        style={{ color: "#555e6b", padding: 0 }}
                                                    >
                                                        Thiết lập mặc định
                                                    </Button>

                                                    <Popconfirm
                                                        title="Xóa địa chỉ này?"
                                                        onConfirm={() => handleDeleteAddress(item.id)}
                                                        okText="Xóa"
                                                        cancelText="Hủy"
                                                    >
                                                        <Button
                                                            type="link"
                                                            size="small"
                                                            danger
                                                            icon={<DeleteOutlined />}
                                                            style={{ padding: 0 }}
                                                        >
                                                            Xóa
                                                        </Button>
                                                    </Popconfirm>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB 4: Recent Orders */}
                    {activeTab === "orders" && (
                        <div>
                            <div className="tab-header">
                                <h2 className="tab-title">Đơn Hàng Của Tôi</h2>
                                <p className="tab-desc">Theo dõi trạng thái các đơn hàng gần đây của bạn</p>
                            </div>

                            {/* Order Stats Header */}
                            <div className="order-stats-grid">
                                <div className="order-stat-card">
                                    <div className="stat-number">3</div>
                                    <div className="stat-label">Tổng đơn hàng</div>
                                </div>
                                <div className="order-stat-card">
                                    <div className="stat-number" style={{ color: "#1677ff" }}>1</div>
                                    <div className="stat-label">Đang giao hàng</div>
                                </div>
                                <div className="order-stat-card">
                                    <div className="stat-number" style={{ color: "#52c41a" }}>2</div>
                                    <div className="stat-label">Đã hoàn thành</div>
                                </div>
                                <div className="order-stat-card">
                                    <div className="stat-number" style={{ color: "#faad14" }}>0</div>
                                    <div className="stat-label">Đơn hủy</div>
                                </div>
                            </div>

                            {/* Orders List */}
                            <div>
                                {mockOrders.map((order) => (
                                    <div className="order-row-item" key={order.id}>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: 14, color: "#22242a" }}>
                                                {order.id}
                                            </div>
                                            <div style={{ fontSize: 12, color: "#8892a0", marginTop: 2 }}>
                                                Ngày đặt: {order.date} • {order.itemsCount} sản phẩm
                                            </div>
                                        </div>

                                        <div style={{ textAlign: "right" }}>
                                            <div style={{ fontWeight: 700, fontSize: 15, color: "#c89968" }}>
                                                {formatCurrency(order.total)}
                                            </div>
                                            <div style={{ marginTop: 4 }}>
                                                {order.status === "shipping" && (
                                                    <Tag icon={<CarOutlined />} color="processing">
                                                        Đang giao hàng
                                                    </Tag>
                                                )}
                                                {order.status === "delivered" && (
                                                    <Tag icon={<CheckCircleOutlined />} color="success">
                                                        Đã giao hàng
                                                    </Tag>
                                                )}
                                                {order.status === "pending" && (
                                                    <Tag icon={<ClockCircleOutlined />} color="warning">
                                                        Chờ xử lý
                                                    </Tag>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Address Modal */}
            <Modal
                title={editingAddress ? "Chỉnh Sửa Địa Chỉ" : "Thêm Địa Chỉ Mới"}
                open={addressModalVisible}
                onCancel={() => setAddressModalVisible(false)}
                onOk={handleSaveAddress}
                okText="Lưu Địa Chỉ"
                cancelText="Hủy"
                okButtonProps={{ style: { backgroundColor: "#22242a", borderColor: "#22242a" } }}
            >
                <Form form={addressForm} layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item
                        label="Họ và tên người nhận"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng nhập tên người nhận!" }]}
                    >
                        <Input placeholder="Nguyễn Văn A" />
                    </Form.Item>

                    <Form.Item
                        label="Số điện thoại nhận hàng"
                        name="phone"
                        rules={[
                            { required: true, message: "Vui lòng nhập số điện thoại!" },
                            { pattern: /^[0-9]{10,11}$/, message: "Số điện thoại gồm 10-11 chữ số!" }
                        ]}
                    >
                        <Input placeholder="0912345678" />
                    </Form.Item>

                    <Form.Item
                        label="Địa chỉ chi tiết"
                        name="address"
                        rules={[{ required: true, message: "Vui lòng nhập địa chỉ chi tiết!" }]}
                    >
                        <Input.TextArea
                            rows={3}
                            placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Profile;
