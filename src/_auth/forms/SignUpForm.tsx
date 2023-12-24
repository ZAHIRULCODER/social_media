import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row, Typography } from "antd";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
	useCreateUserAccount,
	useSignInAccount,
} from "../../tanstack-query/Queries";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

const { Title } = Typography;

const SignUpForm = () => {
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const { checkAuthUser, isLoading: isUserLoading } = useContext(AuthContext);

	//Queries
	const { mutateAsync: createUserAccount, isPending: isCreatingAccount } =
		useCreateUserAccount();
	const { mutateAsync: signInAccount, isPending: isSigningInUser } =
		useSignInAccount();

	const handleSubmitSignUpForm = async (signUpCredentials: any) => {
		try {
			// Create a new user account using the provided data
			const createdUser = await createUserAccount(signUpCredentials);

			// If createdUser is null, display an error message and return early from the function
			if (!createdUser) {
				toast.error("Sign up failed! Please try again.");
				return;
			}

			// Sign in the newly created user
			const session = await signInAccount({
				email: signUpCredentials?.email,
				password: signUpCredentials?.password,
			});


			// If session is null, display an error message and redirect to sign-in
			if (!session) {
				toast.error("Something went wrong. Please sign in to your new account");
				navigate("/auth/sign-in");
				return;
			}

			// Check if the user is authenticated
			const isLoggedIn = await checkAuthUser();


			// If the user is authenticated, navigate to the home page and display a success message
			if (isLoggedIn) {
				navigate("/home");
				toast.success("Sign up successfull! Welcome aboard.");
				form.resetFields();
			} else {
				toast.error("Sign in failed! Please try again. ye wala kya ?");
			}
		} catch (error) {
			console.error("An error occurred while signing up the user:", error);
		}
	};

	return (
		<Row justify="center" align="middle" style={{ height: "90vh" }}>
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
					onFinish={handleSubmitSignUpForm}>
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
							{
								min: 8,
								message: "Password must be atleast 8 characters long.",
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
							disabled={isCreatingAccount || isSigningInUser || isUserLoading}
							loading={isCreatingAccount || isSigningInUser || isUserLoading}
							style={{ height: 50, fontSize: 20 }}>
							Sign Up
						</Button>
					</Form.Item>
					<Form.Item>
						<div style={{ textAlign: "center", fontSize: 20 }}>
							Or <Link to="/auth/sign-in">Sign in now!</Link>
						</div>
					</Form.Item>
				</Form>
			</Col>
		</Row>
	);
};

export default SignUpForm;
