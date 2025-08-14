import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AdminRoute = ({ children }) => {
	const [isLoading, setIsLoading] = useState(true); // Loading state for admin check
	const [isAdmin, setIsAdmin] = useState(false); // Admin status
	const navigate = useNavigate();

	useEffect(() => {
		const checkAdmin = async () => {
			const token = localStorage.getItem("accessToken");
			// If no token, user is not authenticated
			if (!token) {
				toast.error("Unauthorized: Please login as admin");
				navigate("/", { replace: true });
				return;
			}
			try {
				// Validate token and check admin role with backend
				const res = await axios.get(
					`${import.meta.env.VITE_BACKEND_URL}/api/check-auth`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				console.log("Admin check response:", res.data.user);
				if (
					res.data &&
					res.data.isAuthenticated &&
					res.data.user &&
					res.data.user.role === "admin"
				) {
					// If user is admin, allow access and redirect to dashboard
					navigate("/admin/dashboard", { replace: true });
					setIsAdmin(true);
				} else {
					// If not admin, redirect to home
					// toast.error("Unauthorized: Admin access required");
					navigate("/");
				}
			} catch (err) {
				// If token invalid/expired, or not admin, redirect to home
				toast.error("Unauthorized: Please login as admin");
				navigate("/", { replace: true });
			} finally {
				setIsLoading(false);
			}
		};
		checkAdmin();
		// eslint-disable-next-line
	}, []);

	// Show nothing while loading admin status
	if (isLoading) return null;
	// Only render children if user is admin
	if (!isAdmin) return null;
	return children;
};

export default AdminRoute;
