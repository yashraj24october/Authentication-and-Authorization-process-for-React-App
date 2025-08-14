import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Logout = () => {
	const navigate = useNavigate();
	const [confirm, setConfirm] = useState(false);
	const [alreadyLoggedOut, setAlreadyLoggedOut] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem("accessToken");
		if (!token) {
			toast("Already logged out");
			setAlreadyLoggedOut(true);
			return;
		}
		if (confirm) {
			localStorage.removeItem("accessToken");
			toast.success("Logged out successfully");
			navigate("/", { replace: true });
		}
	}, [confirm, navigate]);

	if (alreadyLoggedOut) {
		return (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					height: "60vh",
					color: "#222",
					fontWeight: 500,
					fontSize: "1.1rem",
				}}
			>
				<div>Already logged out</div>
				<button
					onClick={() => navigate("/", { replace: true })}
					style={{
						marginTop: 20,
						padding: "0.5em 1.2em",
						borderRadius: 6,
						border: "none",
						background: "#43cea2",
						color: "#fff",
						fontWeight: 600,
						cursor: "pointer",
					}}
				>
					Go to Home
				</button>
			</div>
		);
	}

	if (!confirm) {
		return (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					height: "60vh",
					color: "#222",
					fontWeight: 500,
					fontSize: "1.1rem",
				}}
			>
				<div>Do you really want to logout?</div>
				<div style={{ marginTop: 20 }}>
					<button
						onClick={() => setConfirm(true)}
						style={{
							marginRight: 10,
							padding: "0.5em 1.2em",
							borderRadius: 6,
							border: "none",
							background: "#e74c3c",
							color: "#fff",
							fontWeight: 600,
							cursor: "pointer",
						}}
					>
						Yes
					</button>
					<button
						onClick={() => navigate(-1)}
						style={{
							padding: "0.5em 1.2em",
							borderRadius: 6,
							border: "none",
							background: "#43cea2",
							color: "#fff",
							fontWeight: 600,
							cursor: "pointer",
						}}
					>
						No
					</button>
				</div>
			</div>
		);
	}
	return null;
};

export default Logout;
