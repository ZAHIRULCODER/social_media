import React, { useContext } from "react";
import { useDeletePost, useGetPostById } from "../../tanstack-query/Queries";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { Card, Avatar, Button, Skeleton } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { parseDate } from "../../utils/parseDate";
import PostStats from "../../components/PostStats";

const { Meta } = Card;

const PostDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { data: post, isPending: isLoadingPostDetails } = useGetPostById(id);
	const { mutate: deletePost } = useDeletePost();
	const { user } = useContext(AuthContext);



	const handleDeletePost = () => {
		try {
			const deletedPost = deletePost({
				...post,
				postID: id,
				imageID: post?.imageID,
			});

			if (deletedPost && deletedPost.status === "ok") {
				navigate("/");
			} else {
				console.error("Failed to delete post.");
			}
		} catch (error) {
			console.error("Error deleting post:", error);
		}
	};

	return (
		<>
			{isLoadingPostDetails || !post ? (
				<Skeleton />
			) : (
				<div
					style={{
						width: "100%",
						display: "flex",
						justifyContent: "center",
						padding: "20px",
					}}>
					<Card
						style={{
							border: "1px solid #e0e0e0",
							width: "60%",
							height: "68%",
						}}>
						<div style={{ display: "flex" }}>
							{/* Left side (Image) */}
							<div style={{ marginRight: 16 }}>
								<img
									alt="example"
									src={post?.imageURL}
									style={{ width: 350, height: 330, objectFit: "cover" }}
								/>
							</div>

							{/* Right side (Content) */}
							<div style={{ width: "100%", height: 100 }}>
								{/* Profile Image */}
								<Meta
									avatar={<Avatar size={50} src={post?.creator?.imageURL} />}
									title={post?.creator?.name}
									description={
										<div
											style={{
												width: "100%",
												display: "flex",
												justifyContent: "space-between",
											}}>
											<p style={{ fontSize: 16, fontWeight: 600 }}>
												{parseDate(post?.$createdAt)}
											</p>

											<p style={{ fontSize: 14, fontWeight: 600 }}>
												Place - {post?.location}
											</p>
										</div>
									}
								/>

								{/* Action buttons */}
								<div style={{ marginTop: 16 }}>
									{user?.id === post?.creator?.$id && (
										<>
											<Button
												type="primary"
												icon={<EditOutlined />}
												style={{ marginRight: 8 }}>
												<Link to={`/update-post/${post?.$id}`}>Edit Post</Link>
											</Button>
											<Button
												onClick={handleDeletePost}
												danger
												icon={<DeleteOutlined />}>
												Delete
											</Button>
										</>
									)}
								</div>

								<div style={{ marginTop: 20 }}>
									<p>{post?.caption}</p>
								</div>
								<div>
									<ul
										style={{
											marginTop: 20,
											display: "flex",
											flexWrap: "wrap",
											listStyleType: "none",
											padding: 0,
										}}>
										{post?.tags?.map((tag) => (
											<li key={tag} style={{ marginRight: 10, fontSize: 14 }}>
												#{tag}
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>
						<div style={{ marginTop: 20 }}>
							<PostStats post={post} userID={user?.id} />
						</div>
					</Card>
				</div>
			)}
		</>
	);
};

export default PostDetails;
