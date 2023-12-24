import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../_root/RootLayout";
import ErrorPage from "../_root/pages/ErrorPage";
import AuthLayout from "../_auth/AuthLayout";
import SignInForm from "../_auth/forms/SignInForm";
import SignUpForm from "../_auth/forms/SignUpForm";
import HomePage from "../_root/pages/HomePage";
import ExplorePage from "../_root/pages/ExplorePage";
import SavedPage from "../_root/pages/SavedPage";
import AllUserPage from "../_root/pages/AllUserPage";
import CreatePostPage from "../_root/pages/CreatePostPage";
import UpdatePostPage from "../_root/pages/UpdatePostPage";
import PostDetailPage from "../_root/pages/PostDetailPage";
import ProfilePage from "../_root/pages/ProfilePage";
import UpdateProfilePage from "../_root/pages/UpdateProfilePage";
import AuthProvider from "../context/AuthProvider";

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<AuthProvider>
				<RootLayout />
			</AuthProvider>
		),
		errorElement: <ErrorPage />,
		children: [
			{
				path: "home",
				index: true,
				element: <HomePage />,
			},
			{
				path: "explore",
				element: <ExplorePage />,
			},
			{
				path: "saved-post",
				element: <SavedPage />,
			},
			{
				path: "all-user",
				element: <AllUserPage />,
			},
			{
				path: "explore",
				element: <ExplorePage />,
			},
			{
				path: "create-post",
				element: <CreatePostPage />,
			},
			{
				path: "update-post/:id",
				element: <UpdatePostPage />,
			},
			{
				path: "post-detail/:id",
				element: <PostDetailPage />,
			},
			{
				path: "profile/:id/*",
				element: <ProfilePage />,
			},
			{
				path: "update-profile/:id",
				element: <UpdateProfilePage />,
			},
		],
	},
	{
		path: "/auth",
		element: (
			<AuthProvider>
				<AuthLayout />
			</AuthProvider>
		),
		errorElement: <ErrorPage />,
		children: [
			{
				path: "sign-in",
				element: <SignInForm />,
			},
			{
				path: "sign-up",
				element: <SignUpForm />,
			},
		],
	},
]);

export default router;
