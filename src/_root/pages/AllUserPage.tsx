import {
	Layout,
	Avatar,
	Button,
	Table,
	Typography,
	Card,
	EmptyProps,
} from "antd";
import { useGetAllUsers } from "../../tanstack-query/Queries";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const { Content } = Layout;
const { Title, Text } = Typography;

const AllUserPage = () => {
	const {
		data: creators,
		isLoading,
		isError: isErrorGettingCreators,
	} = useGetAllUsers();

	const columns = [
		{
			title: "Avatar",
			dataIndex: "profilePic",
			width: 120,
			render: (_: EmptyProps, record: any) => (
				<Avatar size={50} src={record?.profilePic} />
			),
		},
		{
			title: "Name",
			dataIndex: "Name",
			render: (_: EmptyProps, record: any) => <Text strong>{record.name}</Text>,
		},
		{
			title: "Email",
			dataIndex: "email",
			render: (_: EmptyProps, record: any) => (
				<Text strong>{record.email}</Text>
			),
		},
		{
			title: "View Profile",
			dataIndex: "id",
			width: 120,
			render: (_: EmptyProps, record: any) => (
				<Button type="primary">
					<Link to={`/profile/${record?.id}`}>View Profile</Link>
				</Button>
			),
		},
	];

	if (isErrorGettingCreators) {
		toast.error("Error getting creators");
	}

	return (
		<Layout style={{ marginLeft: 200 }}>
			<Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
				{/* Title: All Users */}
				<Title level={2}>All Users</Title>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						gap: 20,
					}}>
					<Card>
						<Table
							rowKey="id"
							loading={isLoading && !creators}
							dataSource={creators?.documents?.map((creator) => ({
								id: creator?.$id,
								name: creator?.name,
								email: creator?.email,
								profilePic: creator?.imageURL,
							}))}
							columns={columns}
							style={{ width: 650 }}
						/>
					</Card>
				</div>
			</Content>
		</Layout>
	);
};

export default AllUserPage;
