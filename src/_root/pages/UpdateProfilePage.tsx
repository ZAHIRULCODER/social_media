import {
	Card,
	Input,
	Button,
	Form,
	Layout,
	Typography,
	Space,
	Skeleton,
	message,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { useGetUserById, useUpdateUser } from "../../tanstack-query/Queries";
import CustomFileUploader from "../../components/CustomFileUploader";
import { RcFile } from "antd/es/upload";

const { TextArea } = Input;
const { Content } = Layout;
const { Title } = Typography;

const UpdateProfilePage = () => {
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const { id } = useParams();
	const { user, setUser } = useContext(AuthContext);

	//Queries
	const { data: currentUser } = useGetUserById(id || "");
	const { mutateAsync: updateUser, isPending: isLoadingUpdate } =
		useUpdateUser();

	if (!currentUser) return <Skeleton active />;

	const handleProfileUpdate = async (values: {
		name: string;
		bio: string;
		profile: RcFile[];
	}) => {
		const { name, bio, profile } = values;

		const updatedUser = await updateUser({
			name,
			bio,
			file: profile,
			userID: currentUser?.$id,
			imageURL: currentUser?.imageURL,
			imageID: currentUser?.imageID,
		});

		if (!updatedUser) {
			message.error("Update user failed. Please try again.");
		}

		// Reset the form after a successful update
		form.resetFields();

		setUser({
			...user,
			name: updatedUser?.name,
			bio: updatedUser?.bio,
			imageURL: updatedUser?.imageURL,
		});

		return navigate(`/profile/${id}`);
	};
	return (
		<Layout style={{ marginLeft: 200 }}>
			<Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
				<Title level={2}>Update User Profile</Title>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						gap: 20,
					}}>
					<Form
						layout="vertical"
						form={form}
						name="updateProfileForm"
						initialValues={{
							name: currentUser?.name,
							bio: currentUser?.bio,
							email: currentUser?.email,
							file: [],
						}}
						onFinish={handleProfileUpdate}>
						<Card style={{ width: "800px" }}>
							<Card>
								<Card.Meta
									title="Update Profile"
									description="Manage your profile details."
								/>
							</Card>
							<Card style={{ gap: "1rem" }}>
								<div style={{ gap: "0.5rem" }}>
									<Form.Item label="Email ID (Read-only)" name="email">
										<Input disabled readOnly prefix={<UserOutlined />} />
									</Form.Item>
								</div>
								<div style={{ gap: "0.5rem" }}>
									<Form.Item label="Name" name="name">
										<Input placeholder="Enter your name" />
									</Form.Item>
								</div>
								<div style={{ gap: "0.5rem" }}>
									<Form.Item required label="Profile Photo" name="profile">
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: "0.75rem",
											}}>
											<CustomFileUploader
												form={form}
												fieldName="profile"
												imageURL={currentUser?.imageURL}
											/>
										</div>
									</Form.Item>
								</div>
								<div style={{ gap: "0.5rem" }}>
									<Form.Item label="Bio" name="bio">
										<TextArea
											autoSize={{ minRows: 3 }}
											placeholder="Enter your bio"
										/>
									</Form.Item>
								</div>
							</Card>
							<Space>
								<Button>Cancel</Button>
								<Button
									loading={isLoadingUpdate}
									disabled={isLoadingUpdate}
									type="primary"
									htmlType="submit">
									Update Profile
								</Button>
							</Space>
						</Card>
					</Form>
				</div>
			</Content>
		</Layout>
	);
};

export default UpdateProfilePage;
