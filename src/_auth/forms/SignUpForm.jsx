import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Form, Input, Button, Typography } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import AuthContext from "../../context/AuthContext";
import {
	useCreateUserAccount,
	useSignInAccount,
} from "../../tanstack-query/Queries";

const { Title } = Typography;

const SignUpForm = () => {
	const navigate = useNavigate();
	const { checkAuthUser } = useContext(AuthContext);

	const { mutateAsync: createUserAccount, isPending: isCreatingAccount } =
		useCreateUserAccount();

	const { mutateAsync: signInAccount, isPending: isSigningInUser } =
		useSignInAccount();

	const [form] = Form.useForm();

	const handleSubmit = async (values) => {
		try {
			const newUser = await createUserAccount(values);

			// If newUser is null, then toast an error message and return early from the function
			if (!newUser) {
				return toast.error("Sign up failed! Please try again.");
			}

			const session = await signInAccount(values);

			// If session is null, then toast an error message and return early from the function
			if (!session) {
				toast.error("Something went wrong. Please sign in your new account");
				return navigate("/sign-in");
			}

			// If session is not null, then check if the user is authenticated (see src/context/AuthProvider.jsx)
			const isLoggedIn = await checkAuthUser();

			// If the user is authenticated, then navigate to the home page and toast a success message
			if (isLoggedIn) {
				toast.success("Sign up successful! Welcome aboard.");
				form.resetFields();
				return navigate("/");
			} else {
				return toast.error("Sign in failed! Please try again.");
			}
		} catch (error) {
			console.error(error);
			return toast.error("Sign up failed! Please try again.");
		}
	};

	return (
		<Row justify="center" align="middle" style={{ height: "100vh" }}>
			<Col span={6}>
				<Title level={2} style={{ textAlign: "center" }}>
					Create a new account
				</Title>
				<Form
					form={form}
					autoComplete="off"
					name="normal_signup"
					initialValues={{
						remember: true,
					}}
					onFinish={handleSubmit}>
					<Form.Item
						name="name"
						rules={[
							{
								required: true,
								message: "Please input your Full Name!",
							},
						]}
						style={{ marginBottom: 40 }}
						hasFeedback>
						<Input
							style={{ height: 50, fontSize: 15 }}
							prefix={<UserOutlined />}
							placeholder="Full Name"
						/>
					</Form.Item>
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
							prefix={<MailOutlined />}
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
							prefix={<LockOutlined />}
							placeholder="Password"
						/>
					</Form.Item>
					<Form.Item style={{ marginBottom: 40 }}>
						<Button
							type="primary"
							htmlType="submit"
							block
							disabled={isCreatingAccount || isSigningInUser}
							loading={isCreatingAccount || isSigningInUser}
							style={{ height: 50, fontSize: 20 }}>
							Sign Up
						</Button>
					</Form.Item>
					<Form.Item>
						<div style={{ textAlign: "center", fontSize: 20 }}>
							Or <Link to="/sign-in">Sign in now!</Link>
						</div>
					</Form.Item>
				</Form>
			</Col>
		</Row>
	);
};

export default SignUpForm;
