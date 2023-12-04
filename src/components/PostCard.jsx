import React, { useContext } from "react";
import { Button, Card } from "antd";
import { parseDate } from "../utils/parseDate";
import PostStats from "./PostStats";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";

const { Meta } = Card;

const PostCard = ({ post }) => {
	const { user } = useContext(AuthContext);

	if (!post?.creator) return;

	return (
		<Card
			hoverable
			style={{
				width: 600,
			}}>
			<Meta
				avatar={
					<img
						src={post?.creator?.imageURL}
						alt="creator"
						style={{ width: 50, height: 50, borderRadius: "50%" }}
					/>
				}
				title={post?.creator?.name}
				description={
					<div style={{ display: "flex", justifyContent: "space-between" }}>
						<p style={{ fontSize: 16, fontWeight: 600 }}>
							{parseDate(post?.$createdAt)}
						</p>

						<p style={{ fontSize: 14, fontWeight: 600 }}>
							Place - {post?.location}
						</p>
						{user.id === post.creator.$id ? (
							<Button>
								<Link to={`/update-post/${post?.$id}`}>Edit Post</Link>
							</Button>
						) : null}
					</div>
				}
			/>
			<div style={{ padding: "24px 0" }}>
				<p>{post?.caption}</p>

				<ul
					style={{
						display: "flex",
						flexWrap: "wrap",
						listStyleType: "none",
						padding: 0,
					}}>
					{post.tags.map((tag) => (
						<li key={tag} style={{ marginRight: 10, fontSize: 14 }}>
							#{tag}
						</li>
					))}
				</ul>
			</div>
			<img
				src={post.imageURL}
				alt="post image"
				style={{ width: "100%", borderRadius: 20, objectFit: "cover" }}
			/>
			<PostStats post={post} userID={user.id} />
		</Card>
	);
};

export default PostCard;
