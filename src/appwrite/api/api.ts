import { ID, Query } from "appwrite";
import {
	account,
	avatars,
	databases,
	appwriteConfig,
	storage,
} from "../config/config";
import type { RcFile } from "antd/es/upload";
import {
	IUpdatePost,
	INewPost,
	INewUser,
	IUpdateUser,
	ISaveUserToDB,
} from "../../types/types";

export const createUserAccount = async (user: INewUser) => {
	try {
		const newAccount = await account.create(
			ID.unique(),
			user.email,
			user.password,
			user.name
		);

		if (!newAccount) throw Error;

		const avatarURL = avatars.getInitials(user.name);

		const newUser = await saveUserToDB({
			accountID: newAccount.$id,
			email: newAccount.email,
			name: newAccount.name,
			imageURL: avatarURL,
		});

		return newUser;
	} catch (error) {
		console.error("Error creating user account:", error);
		return error;
	}
};

export const saveUserToDB = async (user: ISaveUserToDB) => {
	try {
		const newUser = await databases.createDocument(
			appwriteConfig.databaseID,
			appwriteConfig.usersCollectionID,
			ID.unique(),
			user
		);

		return newUser;
	} catch (error) {
		console.error("Error saving user to database:", error);
	}
};

export const signInAccount = async (user: {
	email: string;
	password: string;
}) => {
	try {
		const session = await account.createEmailSession(user.email, user.password);
		return session;
	} catch (error) {
		console.error("Error signing in user:", error);
	}
};

export const getAccount = async () => {
	try {
		const currentAccount = await account.get();
		return currentAccount;
	} catch (error) {
		console.error("Error getting account:", error);
	}
};

export const getCurrentUser = async () => {
	try {
		const currentAccount = await getAccount();

		if (!currentAccount) throw Error;

		const currentUser = await databases.listDocuments(
			appwriteConfig.databaseID,
			appwriteConfig.usersCollectionID,
			[Query.equal("accountID", currentAccount.$id)]
		);

		if (!currentUser) throw Error;

		return currentUser.documents[0];
	} catch (error) {
		console.error("Error getting user from database:", error);
		return null;
	}
};

export const signOutAccount = async () => {
	try {
		const session = await account.deleteSession("current");
		return session;
	} catch (error) {
		console.error("Error signing out user:", error);
	}
};

//Posts
export const createPost = async (post: INewPost) => {
	try {
		//upload image to storage
		const uploadedFile = await uploadFile(
			post?.file[0]?.originFileObj as RcFile
		);

		if (!uploadedFile) throw Error;

		//Get the file url
		const fileURL = getFilePreview(uploadedFile.$id);

		if (!fileURL) {
			await deleteFile(uploadedFile.$id); //delete file if the file is corrupted
			throw Error;
		}

		const tags = post.tags;

		//save create new post
		const newPost = await databases.createDocument(
			appwriteConfig.databaseID,
			appwriteConfig.postsCollectionID,
			ID.unique(),
			{
				creator: post.userID,
				caption: post.caption,
				imageURL: fileURL,
				imageID: uploadedFile.$id,
				location: post.location,
				tags: tags,
			}
		);

		if (!newPost) {
			await deleteFile(uploadedFile.$id);
			throw Error;
		}

		return newPost;
	} catch (error) {
		console.error("Error creating post:", error);
	}
};

export const uploadFile = async (file: File) => {
	try {
		const uploadedFile = await storage.createFile(
			appwriteConfig.storageID,
			ID.unique(),
			file
		);

		return uploadedFile;
	} catch (error) {
		console.error("Error uploading file:", error);
	}
};

export const getFilePreview = (fileID: string) => {
	try {
		const fileURL = storage.getFilePreview(
			appwriteConfig.storageID,
			fileID,
			2000,
			2000,
			"top",
			70
		);

		if (!fileURL) throw Error;

		return fileURL;
	} catch (error) {
		console.error("Error getting file preview:", error);
	}
};

export const deleteFile = async (fileID: string) => {
	try {
		await storage.deleteFile(appwriteConfig.storageID, fileID);
		return { status: "OK" };
	} catch (error) {
		console.error("Error deleting file:", error);
	}
};

export const getSearchPosts = async (searchText: string) => {
	try {
		const posts = await databases.listDocuments(
			appwriteConfig.databaseID,
			appwriteConfig.postsCollectionID,
			[Query.search("caption", searchText)]
		);

		if (!posts) throw Error;

		return posts;
	} catch (error) {
		console.error("Error getting search posts:", error);
		return error;
	}
};

export const getInfinitePosts = async ({
	pageParam,
}: {
	pageParam: number;
}) => {
	const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(10)];

	if (pageParam) {
		queries.push(Query.cursorAfter(pageParam.toString()));
	}
	try {
		const posts = await databases.listDocuments(
			appwriteConfig.databaseID,
			appwriteConfig.postsCollectionID,
			queries
		);

		if (!posts) throw Error;

		return posts;
	} catch (error) {
		console.error("Error getting infinite posts:", error);
	}
};

export const getPostById = async (postID?: string) => {
	if (!postID) throw Error;

	try {
		const post = await databases.getDocument(
			appwriteConfig.databaseID,
			appwriteConfig.postsCollectionID,
			postID
		);

		if (!post) throw Error;

		return post;
	} catch (error) {
		console.error("Error getting post by ID:", error);
	}
};

export const updatePost = async (post: IUpdatePost) => {
	const hasFileToUpdate = post.file.length > 0;

	try {
		let image = {
			imageURL: post.imageURL,
			imageID: post.imageID,
		};

		if (hasFileToUpdate) {
			// Upload new file to appwrite storage
			const uploadedFile = await uploadFile(
				post.file[0]?.originFileObj as RcFile
			);
			if (!uploadedFile) throw Error;

			// Get new file url
			const fileURL = getFilePreview(uploadedFile.$id);
			if (!fileURL) {
				await deleteFile(uploadedFile.$id);
				throw Error;
			}

			image = { ...image, imageURL: fileURL, imageID: uploadedFile.$id };
		}

		const tags = post?.tags;

		//  Update post
		const updatedPost = await databases.updateDocument(
			appwriteConfig.databaseID,
			appwriteConfig.postsCollectionID,
			post.postID,
			{
				caption: post.caption,
				imageURL: image.imageURL,
				imageID: image.imageID,
				location: post.location,
				tags: tags,
			}
		);

		// Failed to update
		if (!updatedPost) {
			// Delete new file that has been recently uploaded
			if (hasFileToUpdate) {
				await deleteFile(image.imageID);
			}

			// If no new file uploaded, just throw error
			throw Error;
		}

		// Safely delete old file after successful update
		if (hasFileToUpdate) {
			await deleteFile(post.imageID);
		}

		return updatedPost;
	} catch (error) {
		console.error("Error updating post:", error);
	}
};

export const deletePost = async (postID?: string, imageID?: string) => {
	if (!postID || !imageID) return;

	try {
		const statusCode = await databases.deleteDocument(
			appwriteConfig.databaseID,
			appwriteConfig.postsCollectionID,
			postID
		);

		if (!statusCode) throw Error;

		await deleteFile(imageID);

		return { status: "ok" };
	} catch (error) {
		console.error("Error deleting post:", error);
	}
};

export const likePost = async (postID: string, likesArray: string[]) => {
	try {
		const updatedPost = await databases.updateDocument(
			appwriteConfig.databaseID,
			appwriteConfig.postsCollectionID,
			postID,
			{
				likes: likesArray,
			}
		);

		if (!updatedPost) throw new Error();

		return updatedPost;
	} catch (error) {
		console.error("Error liking post:", error);
	}
};

export const savePost = async (userID: string, postID: string) => {
	try {
		const updatedPost = await databases.createDocument(
			appwriteConfig.databaseID,
			appwriteConfig.savesCollectionID,
			ID.unique(),
			{
				user: userID,
				post: postID,
			}
		);

		if (!updatedPost) throw new Error();

		return updatedPost;
	} catch (error) {
		console.error("Error saving post:", error);
	}
};

export const deleteSavedPost = async (savedRecordID: string) => {
	try {
		const statusCode = await databases.deleteDocument(
			appwriteConfig.databaseID,
			appwriteConfig.savesCollectionID,
			savedRecordID
		);

		if (!statusCode) throw Error();

		return { status: "OK" };
	} catch (error) {
		console.error("Error deleting saved post:", error);
	}
};

export const getUserPosts = async (userID?: string) => {
	if (!userID) return;

	try {
		const post = await databases.listDocuments(
			appwriteConfig.databaseID,
			appwriteConfig.postsCollectionID,
			[Query.equal("creator", userID), Query.orderDesc("$createdAt")]
		);

		if (!post) throw Error;

		return post;
	} catch (error) {
		console.error("Error getting user posts:", error);
	}
};

//Get poplular post (BY HIGHEST LIKE COUNT)
export const getRecentPosts = async () => {
	try {
		const posts = await databases.listDocuments(
			appwriteConfig.databaseID,
			appwriteConfig.postsCollectionID,
			[Query.orderDesc("$createdAt"), Query.limit(20)]
		);
		if (!posts) throw Error;
		return posts;
	} catch (error) {
		console.error("Error getting recent posts:", error);
	}
};

//Users
export const getAllUsers = async (limit?: number) => {
	const queries: any[] = [Query.orderDesc("$createdAt")];

	if (limit) {
		queries.push(Query.limit(limit));
	}

	try {
		const users = await databases.listDocuments(
			appwriteConfig.databaseID,
			appwriteConfig.usersCollectionID,
			queries
		);

		if (!users) throw Error;

		return users;
	} catch (error) {
		console.error("Error getting users:", error);
	}
};

export const getUserById = async (userID: string) => {
	try {
		const user = await databases.getDocument(
			appwriteConfig.databaseID,
			appwriteConfig.usersCollectionID,
			userID
		);

		if (!user) throw Error;

		return user;
	} catch (error) {
		console.error("Error getting user by ID:", error);
	}
};

export const updateUser = async (user: IUpdateUser) => {
	const hasFileToUpdate = user?.file?.length > 0;

	try {
		let image = {
			imageURL: user.imageURL,
			imageID: user.imageID,
		};

		if (hasFileToUpdate) {
			// Upload new file to appwrite storage
			const uploadedFile = await uploadFile(
				user?.file[0]?.originFileObj as RcFile
			);

			if (!uploadedFile) {
				throw new Error("Failed to upload new file");
			}

			// Get new file url
			const fileURL = getFilePreview(uploadedFile.$id);
			if (!fileURL) {
				await deleteFile(uploadedFile.$id);
				throw new Error("Failed to get file URL");
			}

			image = {
				...image,
				imageURL: fileURL,
				imageID: uploadedFile.$id,
			};
		}

		// Update user in the database
		const updatedUser = await databases.updateDocument(
			appwriteConfig.databaseID,
			appwriteConfig.usersCollectionID,
			user.userID,
			{
				name: user.name,
				bio: user.bio,
				imageURL: image.imageURL,
				imageID: image.imageID,
			}
		);

		// Failed to update in the database
		if (!updatedUser) {
			// Delete new file that has been recently uploaded
			if (hasFileToUpdate) {
				await deleteFile(image.imageID);
			}
			// If no new file uploaded, just throw an error
			throw new Error("Failed to update user in the database");
		}

		// Safely delete old file after successful update
		if (user.imageID && hasFileToUpdate) {
			await deleteFile(user.imageID);
		}

		return updatedUser;
	} catch (error) {
		console.error("Error updating user:", error);
	}
};

export const createComment = async (comment: any) => {
	try {
		const newComment = await databases.createDocument(
			appwriteConfig.databaseID,
			appwriteConfig.commentsCollectionID,
			ID.unique(),
			{
				text: comment.text,
				postID: comment.postID,
				userID: comment.userID,
				name: comment.name,
				imageURL: comment.imageURL,
			}
		);

		if (!newComment) throw Error;

		return newComment;
	} catch (error) {
		console.error("Error creating comment:", error);
	}
};

export const deleteComment = async (commentID: string) => {
	try {
		const statusCode = await databases.deleteDocument(
			appwriteConfig.databaseID,
			appwriteConfig.commentsCollectionID,
			commentID
		);

		if (!statusCode) throw Error;
		return { status: "OK" };
	} catch (error) {
		console.error("Error deleting comment:", error);
	}
};

export const updateComment = async (comment: any) => {
	try {
		const updatedComment = await databases.updateDocument(
			appwriteConfig.databaseID,
			appwriteConfig.commentsCollectionID,
			comment.commentID,
			{
				text: comment.text,
			}
		);

		if (!updatedComment) throw Error;

		return updatedComment;
	} catch (error) {
		console.error("Error updating comment:", error);
	}
};

export const getCommentsByPostId = async (postID: string) => {
	try {
		const comment = await databases.listDocuments(
			appwriteConfig.databaseID,
			appwriteConfig.commentsCollectionID,
			[Query.equal("postID", postID), Query.orderAsc("$id")]
		);

		if (!comment) throw Error;

		return comment;
	} catch (error) {
		console.error("Error getting comments by post ID:", error);
	}
};
