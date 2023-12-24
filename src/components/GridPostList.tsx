import { Models } from "appwrite";
import { Avatar, Card, Col, Image, Row, Tag } from "antd";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const { Meta } = Card;

type GridPostListProps = {
	posts: Models.Document[];
};

const GridPostList = ({ posts }: GridPostListProps) => {
	const { user } = useContext(AuthContext);

	return (
		<Row gutter={16}>
			{posts.map((post) => (
				<Col key={post?.$id} className="gutter-row" span={6}>
					<Card
						loading={!post}
						style={{ marginTop: 20, width: 320 }}
						cover={
							<Image height={270} alt="post image" src={post?.imageURL} />
						}>
						<Link to={`/post-detail/${post?.$id}`}>
							<Meta
								avatar={<Avatar size={40} src={post?.creator?.imageURL} />}
								title={post?.creator?.name}
								description={
									<div
										style={{
											maxHeight: 25,
											overflow: "hidden",
											textOverflow: "ellipsis",
										}}>
										{post?.caption}
									</div>
								}
							/>
							<div style={{ marginTop: 15 }}>
								{post?.tags?.slice(0, 2).map((tag: [], index: number) => (
									<Tag
										key={index}
										style={{ marginRight: 8, whiteSpace: "nowrap" }}>
										{tag}
									</Tag>
								))}
								{post.tags.length > 3 && (
									<Tag>+{post?.tags?.length - 3} more</Tag>
								)}
							</div>
						</Link>
						<PostStats post={post} userID={user?.id} />
					</Card>
				</Col>
			))}
		</Row>
	);
};

export default GridPostList;
