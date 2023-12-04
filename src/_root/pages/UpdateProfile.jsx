import React, { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, Form, Input, Row, Skeleton, Typography } from "antd";
import { MailOutlined, UserOutlined } from "@ant-design/icons";
import { useGetUserById, useUpdateUser } from "../../tanstack-query/Queries";
import UploadFile from "../../components/UploadFile";
import toast from "react-hot-toast";

const { Title } = Typography;

const UpdateProfile = () => {
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const { id } = useParams();
	const { user, setUser } = useContext(AuthContext);

	const { data: currentUser } = useGetUserById(id || "");
	const { mutateAsync: updateUser, isPending: isLoadingUpdate } =
		useUpdateUser();

	if (!currentUser) return <Skeleton active />;

	const handleUpdate = async (values) => {
		const updatedUser = await updateUser({
			userID: currentUser.$id,
			name: values.name,
			bio: values.bio,
			file: values.file,
			imageURL: currentUser.imageURL,
			imageID: currentUser.imageID,
		});

		if (!updatedUser) {
			toast.error("Update user failed. Please try again.");
		}

		setUser({
			...user,
			name: updatedUser?.name,
			bio: updatedUser?.bio,
			imageURL: updatedUser?.imageURL,
		});

		return navigate(`/profile/${id}`);
	};

	return (
		<div
			style={{
				width: "100%",
				display: "flex",
			}}>
			<div style={{ width: "100%", marginTop: 10, marginBottom: 10 }}>
				<Row justify="center" align="middle" style={{ height: "100vh" }}>
					<Col span={6}>
						<Title level={2} style={{ textAlign: "center" }}>
							Update Profile
						</Title>
						<Form
							form={form}
							autoComplete="off"
							name="normal_signup"
							className="signup-form"
							initialValues={{
								name: user?.name,
								email: user?.email,
								bio: user?.bio || "",
								file: [],
							}}
							onFinish={handleUpdate}>
							<Form.Item name="name" style={{ marginBottom: 40 }} hasFeedback>
								<Input
									style={{ height: 50, fontSize: 15 }}
									prefix={<UserOutlined />}
									placeholder="Full Name"
								/>
							</Form.Item>
							<Form.Item
								name="email"
								rules={[
									{
										type: "email",
										message: "Please enter a valid email address.",
									},
								]}
								style={{ marginBottom: 40 }}
								hasFeedback>
								<Input
									style={{ height: 50, fontSize: 15 }}
									prefix={<MailOutlined className="site-form-item-icon" />}
									readOnly
									placeholder="Email"
								/>
							</Form.Item>

							<div>
								<Title level={4} style={{ textAlign: "start" }}>
									Bio
								</Title>
								<Form.Item name="bio">
									<Input.TextArea rows={10} />
								</Form.Item>
							</div>

							<div>
								<Title level={4} style={{ textAlign: "start" }}>
									Profile Avatar
								</Title>

								<Form.Item style={{ overflow: "hidden" }} name="file">
									<UploadFile
										fieldChange={(file) => form.setFieldsValue({ file })}
										mediaURL={currentUser?.imageURL}
									/>
								</Form.Item>
							</div>
							<div style={{ display: "flex", justifyContent: "space-between" }}>
								<Form.Item style={{ marginBottom: 40 }}>
									<Button
										onClick={() => navigate(-1)}
										htmlType="submit"
										danger
										style={{ height: 50, fontSize: 20 }}>
										Cancel
									</Button>
								</Form.Item>

								<Form.Item style={{ marginBottom: 40 }}>
									<Button
										type="primary"
										htmlType="submit"
										disabled={isLoadingUpdate}
										loading={isLoadingUpdate}
										style={{ height: 50, fontSize: 20 }}>
										Update profile
									</Button>
								</Form.Item>
							</div>
							<Form.Item></Form.Item>
						</Form>
					</Col>
				</Row>
			</div>
		</div>
	);
};

export default UpdateProfile;
