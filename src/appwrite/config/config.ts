import { Client, Account, Databases, Storage, Avatars } from "appwrite";
import conf from "../../conf/conf";

export const appwriteConfig = {
	url: conf.appwriteURL,
	projectID: conf.appwriteProjectID,
	databaseID: conf.appwriteDatabaseID,
	storageID: conf.appwriteStorageID,
	usersCollectionID: conf.appwriteUsersCollectionID,
	postsCollectionID: conf.appwritePostsCollectionID,
	savesCollectionID: conf.appwriteSavesCollectionID,
	commentsCollectionID: conf.appwriteCommentsCollectionID,
};

export const client = new Client();

client.setEndpoint(appwriteConfig.url);
client.setProject(appwriteConfig.projectID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
