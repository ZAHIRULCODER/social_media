import React, { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { Link, useLocation, useParams } from "react-router-dom";
import { Row, Col, Avatar, Typography, Button, Skeleton } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useGetUserById } from "../../tanstack-query/Queries";

const { Title, Text } = Typography;

const Profile = () => {
	const { id } = useParams();
	const { user } = useContext(AuthContext);
	const { pathname } = useLocation();
	const { data: currentUser } = useGetUserById(id);

	if (!currentUser) return <Skeleton active />;

	return (
		<div
			style={{
				width: "100%",
				display: "flex",
				justifyContent: "center",
			}}>
			<div style={{ width: "70%", marginTop: 50 }}>
				<Row justify="center" style={{ marginTop: "20px" }}>
					<Col span={4}>
						<Avatar size={128} src={user?.imageURL} alt="User Avatar" />
					</Col>
					<Col>
						<div>
							<Title level={3}>{currentUser?.name}</Title>
						</div>

						<Row gutter={[20, 20]} style={{ marginTop: "10px" }}>
							<Col>
								<Text strong>{currentUser?.posts?.length}</Text>
								<Text> Posts</Text>
							</Col>
							<Col>
								<Text strong>110</Text>
								<Text> Followers</Text>
							</Col>
							<Col>
								<Text strong>30</Text>
								<Text> Following</Text>
							</Col>
						</Row>

						<Text style={{ marginTop: "10px" }}>{currentUser?.bio}</Text>

						{user.id === currentUser.$id ? (
							<Row justify="space-between" style={{ marginTop: "10px" }}>
								<Button type="primary" icon={<EditOutlined />}>
									<Link to={`/update-profile/${currentUser.$id}`}>
										Edit Profile
									</Link>
								</Button>
								<Button type="primary">Follow</Button>
							</Row>
						) : null}
					</Col>
				</Row>
			</div>
		</div>
	);
};

export default Profile;
