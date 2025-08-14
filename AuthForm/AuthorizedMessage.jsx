import React from "react";
import toast from "react-hot-toast";

const AuthorizedMessage = ({ message }) => {
	React.useEffect(() => {
		if (message) toast.error(message);
	}, [message]);
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				height: "60vh",
				color: "#e74c3c",
				fontWeight: 600,
				fontSize: "1.2rem",
			}}
		>
			{message || "Unauthorized"}
		</div>
	);
};

export default AuthorizedMessage;
