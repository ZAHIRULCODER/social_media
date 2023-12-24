const conf = {
	appwriteURL: String(import.meta.env.VITE_APPWRITE_URL),
	appwriteProjectID: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
	appwriteDatabaseID: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
	appwriteStorageID: String(import.meta.env.VITE_APPWRITE_STORAGE_ID),
	appwriteUsersCollectionID: String(import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID),
	appwritePostsCollectionID: String(import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID),
	appwriteSavesCollectionID: String(import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID),
	appwriteCommentsCollectionID: String(import.meta.env.VITE_APPWRITE_COMMENTS_COLLECTION_ID),
};

export default conf;
