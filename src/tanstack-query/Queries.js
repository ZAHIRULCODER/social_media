import {
	useQuery,
	useMutation,
	useQueryClient,
	useInfiniteQuery,
} from "@tanstack/react-query";
import {
	createPost,
	createUserAccount,
	signInAccount,
	signOutAccount,
	getRecentPosts,
	likePost,
	savePost,
	deleteSavedPost,
	getCurrentUser,
	getPostById,
	updatePost,
	deletePost,
	getInfinitePosts,
	getSearchPosts,
	getUserById,
	updateUser,
	getAllUsers,
} from "../appwrite/api";

//Auth Queries
export const useCreateUserAccount = () => {
	return useMutation({
		mutationFn: (user) => createUserAccount(user),
	});
};

export const useSignInAccount = () => {
	return useMutation({
		mutationFn: (user) => signInAccount(user),
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
		mutationFn: (post) => createPost(post),
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
		mutationFn: ({ postID, likesArray }) => likePost(postID, likesArray),
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
		mutationFn: ({ postID, userID }) => savePost(postID, userID),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["getRecentPostss"],
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
		mutationFn: (savedRecordID) => deleteSavedPost(savedRecordID),
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

export const useGetUserById = (userID) => {
	return useQuery({
		queryKey: ["getUserById", userID],
		queryFn: () => getUserById(userID),
		enabled: !!userID,
	});
};

export const useUpdateUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (user) => updateUser(user),
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

export const useGetAllUsers = (limit) => {
	return useQuery({
		queryKey: ["getAllUsers"],
		queryFn: () => getAllUsers(limit),
	});
};

//Post Queries
export const useGetPostById = (postID) => {
	return useQuery({
		queryKey: ["getPostById", postID],
		queryFn: () => getPostById(postID),
		enabled: !!postID,
	});
};

export const useUpdatePost = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (post) => updatePost(post),
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
		mutationFn: ({ postID, imageID }) => deletePost(postID, imageID),
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
		queryFn: getInfinitePosts,
		initialPageParam: 0,
		getNextPageParam: (lastPage) => {
			if (lastPage && lastPage?.documents?.length === 0) return null;
			const lastID = lastPage?.documents[lastPage?.documents?.length - 1].$id;
			return lastID;
		},
	});
};

export const useGetSearchPosts = (searchText) => {
	return useQuery({
		queryKey: ["getSearchPosts", searchText],
		queryFn: () => getSearchPosts(searchText),
		enabled: !!searchText,
	});
};
