import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import { List, Avatar, Space, Typography, Row, Col, Skeleton } from "antd";
import { UserOutlined } from "@ant-design/icons";
import PostStats from "../components/PostStats";

const { Text } = Typography;

const GridPostList = ({ posts, showUser = true, showStats = true }) => {
	const { user } = useContext(AuthContext);
	if (!posts) return <Skeleton active />;


	return (
		<div>
			<List
				grid={{
					gutter: 16,
					xs: 1,
					sm: 1,
					md: 2,
					lg: 2,
					xl: 2,
					xxl: 2,
				}}
				dataSource={posts}
				renderItem={(post) => (
					<List.Item style={{ borderRadius: "10px", overflow: "hidden" }}>
						<div style={{ position: "relative" }}>
							<Link to={`/post-details/${post.$id}`}>
								<img
									src={post?.imageURL}
									alt="post"
									style={{ height: "100%", width: "100%" }}
								/>
							</Link>
							<Row
								style={{
									position: "absolute",
									bottom: 0,
									width: "100%",
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									padding: "8px",
									backgroundColor: "rgba(0, 0, 0, 0.6)",
								}}>
								{showUser && (
									<Col>
										<Space
											style={{
												display: "flex",
												alignItems: "center",
												gap: "2",
											}}>
											<Avatar
												src={post?.creator?.imageURL}
												alt="creator"
												size={64}
												icon={<UserOutlined />}
											/>
											<Text
												style={{
													overflow: "hidden",
													textOverflow: "ellipsis",
													whiteSpace: "nowrap",
													color: "white",
												}}>
												{post?.creator?.name}
											</Text>
										</Space>
									</Col>
								)}
								{showStats && (
									<Col style={{color: "white"}}>
										<PostStats post={post} userID={user.id} />
									</Col>
								)}
							</Row>
						</div>
					</List.Item>
				)}
			/>
		</div>
	);
};

export default GridPostList;
