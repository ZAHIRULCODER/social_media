import { Models } from "appwrite";
import { LikeOutlined, SaveOutlined } from "@ant-design/icons";
import { parseDate } from "../utils/parseDate";
import { Button, Space, Tooltip, Typography } from "antd";
import React, { useEffect, useState } from "react";
import {
	useDeleteSavedPost,
	useGetCurrentUser,
	useLikePost,
	useSavePost,
} from "../tanstack-query/Queries";
import { checkIsLiked } from "../utils/checkIsLiked";

const { Text } = Typography;

type PostStatsProps = {
	post: Models.Document;
	userID: string;
};

const PostStats = ({ post, userID }: PostStatsProps) => {
	const likesList = post?.likes?.map((user: Models.Document) => user?.$id);

	const [likes, setLikes] = useState<string[]>(likesList);
	const [isSaved, setIsSaved] = useState(false);

	//Queries
	const { mutate: likePost, isPending: isLikingPost } = useLikePost();
	const { mutate: savePost, isPending: isSavingPost } = useSavePost();
	const { mutate: deleteSavePost, isPending: isDeletingSavedPost } =
		useDeleteSavedPost();
	const { data: currentUser } = useGetCurrentUser();

	const savedPostRecord = currentUser?.save?.find(
		(record: Models.Document) => record?.post?.$id === post?.$id
	);

	useEffect(() => {
		setIsSaved(!!savedPostRecord);
	}, [currentUser]);

	const handleLikePost = (e: React.MouseEvent) => {
		e.stopPropagation();

		let likesArray = [...likes];

		if (likesArray?.includes(userID)) {
			likesArray = likesArray?.filter((id) => id !== userID);
		} else {
			likesArray.push(userID);
		}

		setLikes(likesArray);
		likePost({ postID: post?.$id, likesArray });
	};

	const handleSavePost = (e: React.MouseEvent) => {
		e.stopPropagation();

		if (savedPostRecord) {
			setIsSaved(false);
			return deleteSavePost(savedPostRecord?.$id);
		}
		savePost({ userID, postID: post?.$id });
		setIsSaved(true);
	};

	return (
		<>
			{/* Icons */}
			<div
				style={{
					display: "flex",
					marginBottom: "8px",
					marginTop: "10px",
				}}>
				<Space>
					<Tooltip title="Like Post">
						<Button
							onClick={(e) => handleLikePost(e)}
							loading={isLikingPost}
							shape="circle"
							icon={
								<LikeOutlined
									style={{
										color: checkIsLiked(likes, userID) ? "red" : "",
									}}
								/>
							}
						/>
					</Tooltip>

					<Tooltip title="Save Post">
						<Button
							onClick={(e) => handleSavePost(e)}
							loading={isSavingPost || isDeletingSavedPost}
							shape="circle"
							icon={<SaveOutlined style={{ color: isSaved ? "purple" : "" }} />}
							style={{ marginLeft: "8px" }}
						/>
					</Tooltip>
				</Space>
			</div>

			{/* Likes Count */}
			<div style={{ marginBottom: "8px" }}>
				<strong>{likes?.length} likes</strong>
			</div>

			{/* Posting Time */}
			<div style={{ marginBottom: "8px" }}>
				<Text>Posted: {parseDate(post?.$createdAt)}</Text>
			</div>
		</>
	);
};

export default PostStats;
