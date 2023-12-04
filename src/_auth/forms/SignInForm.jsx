import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Form, Input, Button, Typography } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import AuthContext from "../../context/AuthContext";
import toast from "react-hot-toast";
import { useSignInAccount } from "../../tanstack-query/Queries";

const { Title } = Typography;

const SignInForm = () => {
	const navigate = useNavigate();
	const { checkAuthUser } = useContext(AuthContext);

	const { mutateAsync: signInAccount, isPending: isSigningInUser } =
		useSignInAccount();

	const [form] = Form.useForm();

	const handleSubmit = async (values) => {
		try {
			// If newUser is not null, then sign in the user with the email and password they just used to create a new account (see src/appwrite/api.js)
			const session = await signInAccount(values);

			// If session is null, then toast an error message and return early from the function
			if (!session) {
				toast.error("Sign in failed! Please check your email and password.");
				return;
			}
			// If session is not null, then check if the user is authenticated (see src/context/AuthProvider.jsx)
			const isLoggedIn = await checkAuthUser();

			// If the user is authenticated, then navigate to the home page and toast a success message
			if (isLoggedIn) {
				navigate("/");
				toast.success("Welcome back! You are now signed in.");

				// form.resetFields();
			} else {
				toast.error("Sign in failed! Please try again.");
				return;
			}

			// console.log(newUser);
		} catch (error) {
			console.error(error);
			toast.error("Sign in failed! Please try again.");
		}
	};

	return (
		<Row justify="center" align="middle" style={{ height: "100vh" }}>
			<Col span={6}>
				<Title level={2} style={{ textAlign: "center" }}>
					Login to your account
				</Title>
				<Form
					form={form}
					autoComplete="off"
					name="normal_signin"
					className="signin-form"
					initialValues={{
						remember: true,
					}}
					onFinish={handleSubmit}>
					<Form.Item
						name="email"
						rules={[
							{ required: true, message: "Please input your Email!" },
							{ type: "email", message: "Please enter a valid email address." },
						]}
						style={{ marginBottom: 40 }}
						hasFeedback>
						<Input
							style={{ height: 50, fontSize: 15 }}
							prefix={<MailOutlined className="site-form-item-icon" />}
							placeholder="Email"
						/>
					</Form.Item>
					<Form.Item
						name="password"
						rules={[
							{
								required: true,
								message: "Please input your Password!",
							},
						]}
						style={{ marginBottom: 40 }}
						hasFeedback>
						<Input.Password
							style={{ height: 50, fontSize: 15 }}
							prefix={<LockOutlined className="site-form-item-icon" />}
							placeholder="Password"
						/>
					</Form.Item>
					<Form.Item style={{ marginBottom: 40 }}>
						<Button
							type="primary"
							htmlType="submit"
							className="login-form-button"
							block
							disabled={isSigningInUser}
							loading={isSigningInUser}
							style={{ height: 50, fontSize: 20 }}>
							Sign in
						</Button>
					</Form.Item>
					<Form.Item>
						<div style={{ textAlign: "center", fontSize: 20 }}>
							Or <Link to="/sign-up">Sign up now!</Link>
						</div>
					</Form.Item>
				</Form>
			</Col>
		</Row>
	);
};

export default SignInForm;
