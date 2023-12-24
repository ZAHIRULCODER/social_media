import { Link, useParams } from "react-router-dom";
import { Avatar, Button, Card, Col, Layout, Row, Typography } from "antd";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { useGetUserById } from "../../tanstack-query/Queries";
import { UserOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const ProfilePage = () => {
	const { id } = useParams();
	const { user } = useContext(AuthContext);

	//Query
	const { data: currentUser } = useGetUserById(id || "");

	return (
		<Layout style={{ marginLeft: 200 }}>
			<Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
				<Title level={2}>User Profile</Title>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						gap: 20,
					}}>
					<Card
						loading={!currentUser}
						style={{
							width: 400,
							margin: "auto",
							textAlign: "center",
							padding: 6,
						}}>
						<Avatar
							size={96}
							src={currentUser?.imageURL}
							alt="User profile picture"
							icon={<UserOutlined />}
						/>
						<Title level={2}>{currentUser?.name}</Title>
						<Paragraph>{currentUser?.bio}</Paragraph>
						<Row justify="space-around">
							<Col>
								<Paragraph strong>Followers</Paragraph>
								<Paragraph>1234</Paragraph>
							</Col>
							<Col>
								<Paragraph strong>Following</Paragraph>
								<Paragraph>5678</Paragraph>
							</Col>
						</Row>
						{currentUser?.$id === user?.id && (
							<Button type="primary" ghost>
								<Link to={`/update-profile/${currentUser?.$id}`}>
									Edit Profile
								</Link>
							</Button>
						)}
					</Card>
				</div>
			</Content>
		</Layout>
	);
};

export default ProfilePage;
