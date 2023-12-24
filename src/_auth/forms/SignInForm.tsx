import { useContext } from "react";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { useSignInAccount } from "../../tanstack-query/Queries";
import toast from "react-hot-toast";

const { Title } = Typography;

const SignInForm = () => {
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const { checkAuthUser, isLoading: isUserLoading } = useContext(AuthContext);

	//Query
	const { mutateAsync: signInAccount, isPending: isSigningInUser } =
		useSignInAccount();

	const handleSubmitSignInForm = async (signInCredentials: any) => {
		try {
			// If signInCredentials is not null, then sign in the user with the provided credentials
			const session = await signInAccount(signInCredentials);

			// If session is null, then display an error message and return early from the function
			if (!session) {
				toast.error("Sign-in failed! Please check your email and password.");
				navigate("/auth/sign-in");
				return;
			}
			// If session is not null, then check if the user is authenticated
			const isLoggedIn = await checkAuthUser();

			// If the user is authenticated, navigate to the home page and display a success message
			if (isLoggedIn) {
				navigate("/home");
				toast.success("Welcome back! You are now signed in.");
				form.resetFields();
			} else {
				toast.error("Sign-in failed! Please try again.");
				return;
			}
		} catch (error) {
			console.error("An error occurred while signing in the user:", error);
		}
	};

	return (
		<Row justify="center" align="middle" style={{ height: "90vh" }}>
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
					onFinish={handleSubmitSignInForm}>
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
							{
								min: 8,
								message: "Password must be atleast 8 characters long.",
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
							disabled={isSigningInUser || isUserLoading}
							loading={isSigningInUser || isUserLoading}
							style={{ height: 50, fontSize: 20 }}>
							Sign in
						</Button>
					</Form.Item>
					<Form.Item>
						<div style={{ textAlign: "center", fontSize: 20 }}>
							Or <Link to="/auth/sign-up">Sign up now!</Link>
						</div>
					</Form.Item>
				</Form>
			</Col>
		</Row>
	);
};

export default SignInForm;
