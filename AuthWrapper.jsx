import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthorizedMessage from "../Pages/AuthForm/AuthorizedMessage";

const AuthWrapper = ({ children }) => {
	const [isLoading, setIsLoading] = useState(true); // Loading state for auth check
	const [isAuthenticated, setIsAuthenticated] = useState(false); // Auth status
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const checkAuth = async () => {
			const token = localStorage.getItem("accessToken");
			// If no token, user is not authenticated
			if (!token) {
				setIsAuthenticated(false);
				setIsLoading(false);
				return;
			}
			try {
				// Validate token with backend
				const res = await axios.get(
					`${import.meta.env.VITE_BACKEND_URL}/api/check-auth`,
					{
						headers: { Authorization: `Bearer ${token}` },
						withCredentials: true,
					}
				);
				if (res.data && res.data.isAuthenticated) {
					// If backend returns a new token (refresh), update localStorage
					if (res.data.accessToken) {
						localStorage.setItem("accessToken", res.data.accessToken);
					}
					setIsAuthenticated(true);
					// If already logged in and on login page, redirect to home
					if (location.pathname === "/login") {
						toast("Already logged-in");
						navigate("/", { replace: true });
					}
				} else {
					setIsAuthenticated(false);
				}
			} catch (err) {
				// If token/refresh token invalid or expired, remove token and redirect to login
				if (err.response && err.response.status === 401) {
					localStorage.removeItem("accessToken");
					navigate("/login", { replace: true });
				}
				setIsAuthenticated(false);
			} finally {
				setIsLoading(false);
			}
		};
		checkAuth();
	}, [location.pathname]);

	// Show nothing while loading auth status
	if (isLoading) return null;
	// Allow login page to render if not authenticated
	if (!isAuthenticated && location.pathname === "/login") {
		return children;
	}
	// Show unauthorized message for protected routes
	if (!isAuthenticated && location.pathname !== "/login") {
		return (
			<AuthorizedMessage message="Unauthorized: Please login to access this page." />
		);
	}
	// Render children if authenticated
	return children;
};

export default AuthWrapper;
