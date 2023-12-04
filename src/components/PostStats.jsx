import React, { useEffect, useState } from "react";
import { Spin, Flex } from "antd";
import {
	HeartOutlined,
	HeartFilled,
	SaveOutlined,
	SaveFilled,
	LoadingOutlined,
} from "@ant-design/icons";
import {
	useDeleteSavedPost,
	useGetCurrentUser,
	useLikePost,
	useSavePost,
} from "../tanstack-query/Queries";
import toast from "react-hot-toast";

const PostStats = ({ post, userID }) => {
	const likesList = post?.likes?.map((user) => user.$id);

	const [likes, setLikes] = useState(likesList);
	const [isSaved, setIsSaved] = useState(false);

	const { mutate: likePost } = useLikePost();
	const { mutate: savePost, isPending: isSavingPost } = useSavePost();
	const { mutate: deleteSavePost, isPending: isDeletingSavedPost } =
		useDeleteSavedPost();

	const { data: currentUser } = useGetCurrentUser();

	const savedPostRecord = currentUser?.save?.find(
		(record) => record?.post?.$id === post?.$id
	);

	useEffect(() => {
		setIsSaved(!!savedPostRecord);
	}, [currentUser]);

	const handleLikePost = (e) => {
		e.stopPropagation();

		let likesArray = [...likes];

		const isLiked = likesArray.includes(userID);

		if (isLiked) {
			likesArray = likesArray.filter((id) => id !== userID);
		} else {
			likesArray.push(userID);
		}

		setLikes(likesArray);
		likePost({ postID: post.$id, likesArray });
	};

	const handleSavePost = (e) => {
		e.stopPropagation();

		if (savedPostRecord) {
			setIsSaved(false);
			deleteSavePost(savedPostRecord.$id);
			toast.success("Post removed from saved");
		} else {
			savePost({ postID: post.$id, userID });
			setIsSaved(true);
			toast.success("Post saved");
		}
	};

	const checkedIsLiked = (likeList, userID) => {
		return likeList?.includes(userID);
	};

	return (
		<Flex align="center" justify="space-between">
			<div
				style={{ display: "flex", alignItems: "center" }}
				onClick={handleLikePost}>
				{checkedIsLiked(likes, userID) ? (
					<HeartFilled
						style={{ fontSize: "30px", color: "red", cursor: "pointer" }}
					/>
				) : (
					<HeartOutlined
						style={{ fontSize: "30px", color: "red", cursor: "pointer" }}
					/>
				)}

				<div style={{ marginLeft: 10 }}>
					<p>{likes?.length}</p>
				</div>
			</div>

			<div style={{ marginLeft: 20 }} onClick={handleSavePost}>
				{isSavingPost || isDeletingSavedPost ? (
					<Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
				) : isSaved ? (
					<SaveFilled
						style={{ fontSize: "30px", color: "blueviolet", cursor: "pointer" }}
					/>
				) : (
					<SaveOutlined
						style={{ fontSize: "30px", color: "blueviolet", cursor: "pointer" }}
					/>
				)}
			</div>
		</Flex>
	);
};

export default PostStats;
