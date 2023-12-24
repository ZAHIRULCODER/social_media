export const checkIsLiked = (likeList: string[], userID: string) => {
	return likeList?.includes(userID);
};
