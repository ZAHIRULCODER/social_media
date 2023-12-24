import { UploadFile } from "antd/es/upload/interface";

export type INavLink = {
	imgURL: string;
	route: string;
	label: string;
};

export type IUpdateUser = {
	userID: string;
	name: string;
	bio: string;
	imageID: string;
	imageURL: URL | string;
	file: UploadFile[];
};

export type INewPost = {
	userID: string;
	caption: string;
	file: UploadFile[];
	location?: string;
	tags?: string;
};

export type IUpdatePost = {
	postID: string;
	caption: string;
	imageID: string;
	imageURL: URL;
	file: UploadFile[];
	location?: string;
	tags?: string;
};

export type ISaveUserToDB = {
	accountID: string;
	email: string;
	name: string;
	imageURL: URL | string;
};

export type IUser = {
	id: string;
	name: string;
	email: string;
	imageURL: string;
	bio: string;
};

export type INewUser = {
	name: string;
	email: string;
	password: string;
};


export type IAuthContextProps = {
	user: IUser;
	isLoading: boolean;
	isAuthenticated: boolean;
	setUser: React.Dispatch<React.SetStateAction<IUser>>;
	setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
	checkAuthUser: () => Promise<boolean>;
};
