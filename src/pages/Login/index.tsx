import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Modal, message } from "antd";
import { MailOutlined, LockOutlined, SafetyOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import config from "../../config/config";
import "../Auth/Auth.css";

interface LoginFormValues {
    email: string;
    password: string;
    remember: boolean;
}

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [forgotModalVisible, setForgotModalVisible] = useState(false);
    const [forgotLoading, setForgotLoading] = useState(false);
    const [forgotForm] = Form.useForm();

    // Handle Form Submit
    const onFinish = (values: LoginFormValues) => {
        setLoading(true);
        console.log("Login submitted:", values);

        setTimeout(() => {
            setLoading(false);
            message.success({
                content: `Chào mừng bạn trở lại, ${values.email.split("@")[0]}! Đăng nhập thành công.`,
                icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
                duration: 3,
            });
            // Direct to home page or previous page
            navigate("/");
        }, 1200);
    };

    // Handle Forgot Password Submit
    const handleForgotSubmit = async () => {
        try {
            const values = await forgotForm.validateFields();
            setForgotLoading(true);
            
            setTimeout(() => {
                setForgotLoading(false);
                setForgotModalVisible(false);
                forgotForm.resetFields();
                message.success(`Hướng dẫn đặt lại mật khẩu đã được gửi đến email: ${values.forgotEmail}`);
            }, 1000);
        } catch {
            // Validation failed
        }
    };

    return (
        <div className="auth-page-container" style={{ flexDirection: "column" }}>
            {/* Top Brand Logo */}
            <div
                onClick={() => navigate("/")}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    cursor: "pointer",
                    marginBottom: 24,
                }}
            >
                <img src="/favicon.svg" alt="Essential" style={{ width: 44, height: 44 }} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: "#22242a", lineHeight: 1.2 }}>Essential</span>
                    <span style={{ fontSize: 11, color: "#c89968", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Thời trang cao cấp</span>
                </div>
            </div>

            <div className="auth-card">
                {/* Header */}
                <div className="auth-header">
                    <div className="auth-badge">
                        <SafetyOutlined />
                        <span>Bảo mật 100%</span>
                    </div>
                    <h1 className="auth-title">Đăng Nhập Tài Khoản</h1>
                    <p className="auth-subtitle">Nhập thông tin đăng nhập của bạn để tiếp tục mua sắm</p>
                </div>

                {/* Login Form */}
                <Form
                    name="login_form"
                    className="auth-form"
                    layout="vertical"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    {/* Email / Username Input */}
                    <Form.Item
                        label="Email hoặc Tên đăng nhập"
                        name="email"
                        rules={[
                            { required: true, message: "Vui lòng nhập Email hoặc Tên đăng nhập!" },
                            { type: "email", message: "Email không đúng định dạng!" }
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="name@example.com"
                            size="large"
                        />
                    </Form.Item>

                    {/* Password Input */}
                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[
                            { required: true, message: "Vui lòng nhập mật khẩu của bạn!" },
                            { min: 6, message: "Mật khẩu phải chứa ít nhất 6 ký tự!" }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="••••••••"
                            size="large"
                        />
                    </Form.Item>

                    {/* Options Row */}
                    <div className="auth-options">
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                        </Form.Item>
                        <span
                            className="auth-forgot-link"
                            onClick={() => setForgotModalVisible(true)}
                        >
                            Quên mật khẩu?
                        </span>
                    </div>

                    {/* Submit Button */}
                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="auth-submit-btn"
                            loading={loading}
                            block
                        >
                            Đăng Nhập
                        </Button>
                    </Form.Item>
                </Form>

                {/* Social Login Divider */}
                <div className="auth-divider">
                    <span>Hoặc tiếp tục với</span>
                </div>

                {/* Social Buttons */}
                <div className="social-login-grid">
                    <button
                        type="button"
                        className="social-btn"
                        onClick={() => message.info("Tính năng Đăng nhập với Google đang được phát triển")}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.36 24 12 24z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
                            />
                        </svg>
                        <span>Google</span>
                    </button>

                    <button
                        type="button"
                        className="social-btn"
                        onClick={() => message.info("Tính năng Đăng nhập với Facebook đang được phát triển")}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <span>Facebook</span>
                    </button>
                </div>

                {/* Switch to Register */}
                <div className="auth-footer">
                    <span>Bạn chưa có tài khoản?</span>
                    <span
                        className="auth-footer-link"
                        onClick={() => navigate(`/${config.routes.REGISTER}`)}
                    >
                        Đăng ký ngay
                    </span>
                </div>
            </div>

            {/* Forgot Password Modal */}
            <Modal
                title="Khôi phục Mật khẩu"
                open={forgotModalVisible}
                onCancel={() => {
                    setForgotModalVisible(false);
                    forgotForm.resetFields();
                }}
                footer={[
                    <Button
                        key="cancel"
                        onClick={() => {
                            setForgotModalVisible(false);
                            forgotForm.resetFields();
                        }}
                    >
                        Hủy
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={forgotLoading}
                        onClick={handleForgotSubmit}
                        style={{ backgroundColor: "#22242a", borderColor: "#22242a" }}
                    >
                        Gửi liên kết khôi phục
                    </Button>,
                ]}
            >
                <p style={{ color: "#666e7a", fontSize: 13, marginBottom: 16 }}>
                    Vui lòng nhập địa chỉ email đã đăng ký tài khoản của bạn. Chúng tôi sẽ gửi hướng dẫn cài đặt lại mật khẩu qua email.
                </p>
                <Form form={forgotForm} layout="vertical">
                    <Form.Item
                        name="forgotEmail"
                        label="Email khôi phục"
                        rules={[
                            { required: true, message: "Vui lòng nhập email!" },
                            { type: "email", message: "Email không hợp lệ!" }
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="nhap-email-cua-ban@gmail.com"
                            size="large"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Login;
