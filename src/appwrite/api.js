import { ID, Query } from "appwrite";
import { account, avatars, databases, appwriteConfig, storage } from "./config";

export const createUserAccount = async (user) => {
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

export const saveUserToDB = async (user) => {
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

export const signInAccount = async (user) => {
	try {
		const session = await account.createEmailSession(user.email, user.password);
		return session;
	} catch (error) {
		console.error("Error signing in user:", error);
	}
};

export const getCurrentUser = async () => {
	try {
		const currentAccount = await account.get();

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
export const createPost = async (post) => {
	try {
		//upload image to stoarge
		const uploadedFile = await uploadFile(post.file[0]);

		if (!uploadedFile) throw Error;

		//Get the file url
		const fileURL = getFilePreview(uploadedFile.$id);

		if (!fileURL) {
			await deleteFile(uploadedFile.$id); //delete file if the file is corrupted
			throw Error;
		}

		//convert tags to array
		const tags = post.tags?.replace(/ /g, "").split(",") || [];

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

export const uploadFile = async (file) => {
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

export const getFilePreview = (fileID) => {
	try {
		const fileURL = storage.getFilePreview(
			appwriteConfig.storageID,
			fileID,
			2000,
			2000,
			"top",
			50
		);

		if (!fileURL) throw Error;

		return fileURL;
	} catch (error) {
		console.error("Error getting file preview:", error);
		return error;
	}
};

export const deleteFile = async (fileID) => {
	try {
		await storage.deleteFile(appwriteConfig.storageID, fileID);
		return { status: "OK" };
	} catch (error) {
		console.error("Error deleting file:", error);
	}
};

export const getRecentPosts = async () => {
	try {
		const posts = await databases.listDocuments(
			appwriteConfig.databaseID,
			appwriteConfig.postsCollectionID,
			[Query.orderDesc("$createdAt", Query.limit(20))]
		);
		if (!posts) throw Error;
		return posts;
	} catch (error) {
		console.error("Error getting recent posts:", error);
	}
};

export const likePost = async (postID, likesArray) => {
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

export const savePost = async (postID, userID) => {
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

export const deleteSavedPost = async (savedRecordID) => {
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

export const getPostById = async (postID) => {
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

export const updatePost = async (post) => {
	const hasFileToUpdate = post.file.length > 0;

	try {
		let image = {
			imageURL: post.imageURL,
			imageID: post.imageID,
		};

		if (hasFileToUpdate) {
			// Upload new file to appwrite storage
			const uploadedFile = await uploadFile(post.file[0]);
			if (!uploadedFile) throw Error;

			// Get new file url
			const fileUrl = getFilePreview(uploadedFile.$id);
			if (!fileUrl) {
				await deleteFile(uploadedFile.$id);
				throw Error;
			}

			image = { ...image, imageURL: fileUrl, imageID: uploadedFile.$id };
		}

		// Convert tags into array
		const tags = post.tags?.replace(/ /g, "").split(",") || [];

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

export const deletePost = async (postID, imageID) => {
	if (!postID || !imageID) return;

	try {
		const statusCode = await databases.deleteDocument(
			appwriteConfig.databaseID,
			appwriteConfig.postsCollectionID,
			postID
		);

		if (!statusCode) throw Error;

		await deleteFile(imageID);

		return { status: "Ok" };
	} catch (error) {
		console.error("Error deleting post:", error);
	}
};

export const getInfinitePosts = async ({ pageParam }) => {
	try {
		const queries = [Query.orderDesc("$updatedAt", Query.limit(10))];

		if (pageParam) {
			queries.push(Query.cursorAfter(pageParam.toString()));
		}
		const posts = await databases.listDocuments(
			appwriteConfig.databaseID,
			appwriteConfig.postsCollectionID,
			queries
		);

		if (!posts) throw Error;

		return posts;
	} catch (error) {
		console.error("Error getting infinite posts:", error);
		return error;
	}
};

export const getSearchPosts = async (searchText) => {
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

export const getAllUsers = async (limit) => {
	const queries = [Query.orderDesc("$createdAt")];

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

export const getUserById = async (userID) => {
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

export const updateUser = async (user) => {
	const hasFileToUpdate = user.file.length > 0;
	try {
		let image = {
			imageURL: user.imageURL,
			imageID: user.imageID,
		};

		if (hasFileToUpdate) {
			// Upload new file to appwrite storage
			const uploadedFile = await uploadFile(user.file[0]);
			if (!uploadedFile) {
				throw new Error("Failed to upload new file");
			}

			// Get new file url
			const fileURL = getFilePreview(uploadedFile.$id);
			if (!fileURL) {
				await deleteFile(uploadedFile.$id);
				throw new Error("Failed to get file URL");
			}

			image = { ...image, imageURL: fileURL, imageID: uploadedFile.$id };
		}

		// Update user in the database
		const updatedUserInDatabase = await databases.updateDocument(
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
		if (!updatedUserInDatabase) {
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

		return updatedUserInDatabase;
	} catch (error) {
		console.error("Error updating user:", error.message);
		throw error; // Re-throw the error to propagate it further if needed
	}
};
