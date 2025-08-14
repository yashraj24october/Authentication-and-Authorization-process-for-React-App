import React, { use, useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import "./AuthForm.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function AuthForm() {
	const [isLogin, setIsLogin] = useState(true); // Toggle between login/register
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
		watch,
	} = useForm();
	const [registerError, setRegisterError] = useState(""); // Registration error state
	const [usernameError, setUsernameError] = useState(""); // Username validation error
	const password = watch("password", "");
	const username = watch("username", "");
	const debounceTimeout = useRef();

	// Debounced username check for registration
	useEffect(() => {
		if (!username || isLogin) {
			setUsernameError("");
			return;
		}
		if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
		debounceTimeout.current = setTimeout(async () => {
			try {
				const res = await axios.get(
					`${
						import.meta.env.VITE_BACKEND_URL
					}/api/user-check?username=${username}`
				);
				if (res.data.user_data != null) {
					setUsernameError(
						"Username already exists. Choose a different username."
					);
				} else {
					setUsernameError("");
				}
			} catch (err) {
				setUsernameError("");
			}
		}, 500);
		return () => {
			if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
		};
	}, [username, isLogin]);

	// Toggle between login and register forms
	const toggleForm = () => {
		setIsLogin(!isLogin);
		reset(); // reset form fields when toggling
	};

	// Form submission handler for login/register
	const onSubmit = async (data) => {
		if (isLogin) {
			try {
				// Login API request
				const response = await axios.post(
					`${import.meta.env.VITE_BACKEND_URL}/api/login`,
					{
						username: data.username,
						password: data.password,
						remember_me: data.remember_me || false,
					}
				);
				if (response.status === 200 && response.data.accessToken) {
					localStorage.setItem("accessToken", response.data.accessToken); // Save token
					toast.success("Login Successful");
					// Redirect based on user role
					if (
						response.data.user_data &&
						response.data.user_data.role === "admin"
					) {
						setTimeout(() => {
							window.location.href = "/admin/dashboard";
						}, 2000);
					} else {
						setTimeout(() => {
							window.location.href = "/";
						}, 2000);
					}
				}
			} catch (error) {
				// Handle login errors
				if (error.response && error.response.status === 401) {
					toast.error("Invalid username or password");
				} else {
					toast.error("Login failed. Please try again.");
				}
			}
		} else {
			try {
				// Prepare registration data
				data.password = String(data.password);
				if (data.confirm_password !== undefined) {
					data.confirm_password = String(data.confirm_password);
				}
				if (!usernameError) {
					const formData = new FormData();
					formData.append("username", data.username);
					formData.append("password", data.password || "");
					formData.append("confirm_password", data.confirm_password || "");
					formData.append("email", data.email || "");
					formData.append("contact_number", data.contact_number || "");
					formData.append("address", data.address || "");
					formData.append("gender", data.gender || "");
					if (data.profile_image && data.profile_image.length > 0) {
						formData.append("profile_image", data.profile_image[0]);
					}
					console.log("Form Data: ", data);
					// Registration API request
					let userSaveResponse = await axios.post(
						`${import.meta.env.VITE_BACKEND_URL}/api/register`,
						formData,
						{
							headers: {
								"Content-Type": "multipart/form-data",
							},
						}
					);
					if (userSaveResponse.data != null) {
						toast.success("User registered successfully!", { icon: "🎉" });
						console.log("User registered successfully:", userSaveResponse.data);
					} else {
						toast.error("Failed to save user.");
					}
				} else {
					toast.error(usernameError || "Username error");
					reset();
					return;
				}
			} catch (error) {
				setRegisterError("Registration failed. Please try again.");
				console.error("Error during registration:", error);
			}
		}
	};

	return (
		<div className="auth-form-container">
			<Toaster position="top-right" />
			<div className="auth-box">
				<h2>{isLogin ? "Login" : "Register"}</h2>
				<form onSubmit={handleSubmit(onSubmit)}>
					{/* Username input */}
					<div className="input-group">
						<label>Username</label>
						<input
							type="text"
							placeholder="Your Username"
							{...register("username", { required: true })}
						/>
						{errors.username && (
							<span className="error">Username is required</span>
						)}
						{usernameError && <span className="error">{usernameError}</span>}
					</div>

					{/* Registration only fields */}
					{!isLogin && (
						<div className="input-group">
							<label>Full Name</label>
							<input
								type="text"
								placeholder="Your Name"
								{...register("fullName")}
							/>
							{errors.fullName && (
								<span className="error">Full Name is required</span>
							)}
						</div>
					)}

					{!isLogin && (
						<div className="input-group">
							<label>Email</label>
							<input
								type="email"
								placeholder="Your Email"
								{...register("email", { required: true })}
							/>
							{errors.email && <span className="error">Email is required</span>}
						</div>
					)}
					{!isLogin && (
						<div className="input-group">
							<label>Profile Image</label>
							<input
								type="file"
								accept="image/*"
								{...register("profile_image")}
							/>
							{errors.profile_image && (
								<span className="error">Profile image is required</span>
							)}
						</div>
					)}
					{!isLogin && (
						<div className="input-group">
							<label>Gender</label>
							<select {...register("gender", { required: !isLogin })}>
								<option value="">Select Gender</option>
								<option value="male">Male</option>
								<option value="female">Female</option>
								<option value="other">Other</option>
							</select>
							{errors.gender && (
								<span className="error">Gender is required</span>
							)}
						</div>
					)}

					{!isLogin && (
						<div className="input-group">
							<label>Contact Number</label>
							<input
								type="tel"
								placeholder="Your Contact Number"
								{...register("contact_number", { required: !isLogin })}
							/>
							{errors.contact_number && (
								<span className="error">Contact number is required</span>
							)}
						</div>
					)}
					{!isLogin && (
						<div className="input-group">
							<label>Address</label>
							<input
								type="text"
								placeholder="Your Address"
								{...register("address", { required: !isLogin })}
							/>
							{errors.address && (
								<span className="error">Address is required</span>
							)}
						</div>
					)}

					{/* Password input */}
					<div className="input-group">
						<label>Password</label>
						<input
							type="password"
							placeholder="••••••••"
							{...register("password", { required: true })}
						/>
						{errors.password && (
							<span className="error">Password is required</span>
						)}
					</div>
					{!isLogin && (
						<div className="input-group">
							<label>Confirm Password</label>
							<input
								type="password"
								placeholder="••••••••"
								{...register("confirm_password", {
									required: true,
									validate: (value) =>
										value === password || "Passwords do not match",
								})}
							/>
							{errors.confirm_password && (
								<span className="error">
									{errors.confirm_password.message ||
										"Confirm Password is required"}
								</span>
							)}
						</div>
					)}
					{/* Remember Me for login only */}
					{isLogin && (
						<div className="input-group remember-me-group">
							<label
								style={{
									display: "flex",
									alignItems: "center",
									gap: "0.5em",
									fontWeight: 400,
								}}
							>
								<input
									type="checkbox"
									{...register("remember_me")}
									style={{ width: "1em", height: "1em" }}
								/>
								Remember Me
							</label>
						</div>
					)}

					<button type="submit" className="btn">
						{isLogin ? "Login" : "Register"}
					</button>
				</form>
				<p className="toggle-text">
					{isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
					<span onClick={toggleForm}>{isLogin ? "Register" : "Login"}</span>
				</p>
			</div>
		</div>
	);
}
