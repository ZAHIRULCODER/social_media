import {
	useQuery,
	useMutation,
	useQueryClient,
	useInfiniteQuery,
} from "@tanstack/react-query";
import {
	createUserAccount,
	signInAccount,
	getCurrentUser,
	signOutAccount,
	getAllUsers,
	createPost,
	getPostById,
	updatePost,
	getUserPosts,
	deletePost,
	likePost,
	getUserById,
	updateUser,
	getRecentPosts,
	getInfinitePosts,
	getSearchPosts,
	savePost,
	deleteSavedPost,
	createComment,
	getCommentsByPostId,
	deleteComment,
	updateComment,
} from "../appwrite/api/api";
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "../types/types";

//Auth Queries
export const useCreateUserAccount = () => {
	return useMutation({
		mutationFn: (user: INewUser) => createUserAccount(user),
	});
};

export const useSignInAccount = () => {
	return useMutation({
		mutationFn: (user: { email: string; password: string }) =>
			signInAccount(user),
	});
};

export const useSignOutAccount = () => {
	return useMutation({
		mutationFn: signOutAccount,
	});
};

// Post Queries
export const useGetRecentPosts = () => {
	return useQuery({
		queryKey: ["getRecentPosts"],
		queryFn: getRecentPosts,
	});
};

export const useCreatePost = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (post: INewPost) => createPost(post),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["getRecentPosts"],
			});
		},
	});
};

export const useLikePost = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			postID,
			likesArray,
		}: {
			postID: string;
			likesArray: string[];
		}) => likePost(postID, likesArray),

		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ["getPostById", data?.$id],
			});
			queryClient.invalidateQueries({
				queryKey: ["getRecentPosts"],
			});
			queryClient.invalidateQueries({
				queryKey: ["getPosts"],
			});
			queryClient.invalidateQueries({
				queryKey: ["getCurrentUser"],
			});
		},
	});
};

export const useSavePost = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ userID, postID }: { userID: string; postID: string }) =>
			savePost(userID, postID),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["getRecentPosts"],
			});
			queryClient.invalidateQueries({
				queryKey: ["getPosts"],
			});
			queryClient.invalidateQueries({
				queryKey: ["getCurrentUser"],
			});
		},
	});
};

export const useDeleteSavedPost = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (savedRecordID: string) => deleteSavedPost(savedRecordID),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["getRecentPosts"],
			});
			queryClient.invalidateQueries({
				queryKey: ["getPosts"],
			});
			queryClient.invalidateQueries({
				queryKey: ["getCurrentUser"],
			});
		},
	});
};

// User Queries
export const useGetCurrentUser = () => {
	return useQuery({
		queryKey: ["getCurrentUser"],
		queryFn: getCurrentUser,
	});
};

export const useGetUserById = (userID: string) => {
	return useQuery({
		queryKey: ["getUserById", userID],
		queryFn: () => getUserById(userID),
		enabled: !!userID,
	});
};

export const useUpdateUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (user: IUpdateUser) => updateUser(user),
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ["getCurrentUser"],
			});
			queryClient.invalidateQueries({
				queryKey: ["getUserById", data?.$id],
			});
		},
	});
};

export const useGetAllUsers = (limit?: number) => {
	return useQuery({
		queryKey: ["getAllUsers"],
		queryFn: () => getAllUsers(limit),
	});
};

//Post Queries
export const useGetPostById = (postID?: string) => {
	return useQuery({
		queryKey: ["getPostById", postID],
		queryFn: () => getPostById(postID),
		enabled: !!postID,
	});
};

export const useGetUserPosts = (userID?: string) => {
	return useQuery({
		queryKey: ["getUserPosts", userID],
		queryFn: () => getUserPosts(userID),
		enabled: !!userID,
	});
};

export const useUpdatePost = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (post: IUpdatePost) => updatePost(post),
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ["getPostById", data?.$id],
			});
		},
	});
};

export const useDeletePost = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ postID, imageID }: { postID?: string; imageID: string }) =>
			deletePost(postID, imageID),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["getRecentPosts"],
			});
		},
	});
};

export const useGetInfinitePosts = () => {
	return useInfiniteQuery({
		queryKey: ["getInfinitePosts"],
		queryFn: getInfinitePosts as any,
		initialPageParam: 0,
		getNextPageParam: (lastPage: any) => {
			if (lastPage && lastPage?.documents?.length === 0) return null;

			// Use the $id of the last document as the cursor.
			const lastID = lastPage?.documents[lastPage?.documents?.length - 1].$id;
			return lastID;
		},
	});
};

export const useGetSearchPosts = (searchText: string) => {
	return useQuery({
		queryKey: ["getSearchPosts", searchText],
		queryFn: () => getSearchPosts(searchText),
		enabled: !!searchText,
	});
};

// Comment Queries
export const useCreateComment = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (comment: any) => createComment(comment),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["getCommentsByPostId"],
			});
		},
	});
};

export const useDeleteComment = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (commentID: string) => deleteComment(commentID),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["getCommentsByPostId"],
			});
		},
	});
};

export const useUpdateComment = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (comment: any) => updateComment(comment),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["getCommentsByPostId"],
			});
		},
	});
};

export const useGetCommentsByPostId = (postID: string) => {
	return useQuery({
		queryKey: ["getCommentsByPostId", postID],
		queryFn: () => getCommentsByPostId(postID),
		enabled: !!postID,
	});
};
