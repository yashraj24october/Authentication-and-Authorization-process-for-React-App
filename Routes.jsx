import React, { lazy, Suspense } from "react";
import App from "./App";
import Login from "./Pages/AuthForm/AuthForm";
import Homepage from "./Pages/Homepage/Homepage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./Pages/ErrorPage/ErrorPage";
import SearchResultPage from "./Pages/SearchResultPage/SearchResultPage";
import AdminDashboard from "./Pages/AdminDashboard/AdminDashboard";
import UserAccountPage from "./Admin/Pages/UserAccountPage/UserAccountPage";
import AuthWrapper from "./Components/AuthWrapper";
import MenuUpdate from "./Admin/Pages/MenuUpdate/MenuUpdate";
import axios from "axios";
import { ErrorBoundary } from "react-error-boundary";
import AuthForm from "./Pages/AuthForm/AuthForm";
import BasicSiteSettings from "./Admin/Pages/BasicSiteSettings/BasicSiteSettings";
import Users from "./Admin/Pages/Users/Users";
import Dashboard from "./Admin/Components/Dashboard/Dashboard";
import ForgotPassword from "./Pages/AuthForm/ForgotPassword";
import Logout from "./Pages/Logout";
import SeeAndDo from "./Pages/SeeAndDo/SeeAndDo";
import AdminRoute from "./Components/AdminRoute";

const Routes = ({ children }) => {
	const getMenuData = async (menuKey) => {
		const apiUrl = `${
			import.meta.env.VITE_BACKEND_URL
		}/api/admin/menu?menuKey=${menuKey}`;
		const response = await axios.get(apiUrl);
		return response.data;
	};

	let routes = createBrowserRouter([
		{
			path: "/",
			element: <App />,
			errorElement: <ErrorPage />,
			children: [
				{
					index: true,
					element: <AdminRoute><Homepage /></AdminRoute>,
				},
				{
					path: "/login",
					element: <AuthWrapper><AuthForm /></AuthWrapper>,
				},
        {
					path: "/see-and-do",
					element: <AuthWrapper><SeeAndDo/></AuthWrapper>,
				},
        {
					path: "/logout",
					element: <Logout />,
				},
				{
					path: "/search",
					element: <SearchResultPage />,
				},
				{
					path: "/admin",
					element: <AdminDashboard />,
					children: [
						{
							index: true,
							element: <UserAccountPage />,
						},
						{
							path: "dashboard",
							element: <Dashboard />,
						},
						{
							path: "users",
							element: <Users />,
						},
						{
							path: "basic-site-settings",
							element: <BasicSiteSettings />,
						},
						{
							path: "main-navigation-top/edit",

							element: <MenuUpdate menuTitle="Main Navigation Top" />,
							loader: async () => {
								let menuGetResponse = getMenuData("Main Navigation Top");
								return menuGetResponse;
							},
							errorElement: <ErrorPage />,
						},
						{
							path: "main-navigation-bottom/edit",
							element: <MenuUpdate menuTitle="Main Navigation Bottom" />,
							loader: async () => {
								let menuGetResponse = getMenuData("Main Navigation Bottom");
								return menuGetResponse;
							},

							errorElement: <ErrorPage />,
						},
					],
				},
			],
		},
	]);
	return <RouterProvider router={routes}>{children}</RouterProvider>;
};

export default Routes;
