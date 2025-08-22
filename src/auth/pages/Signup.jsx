import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useState } from "react";
import { saveUser, setIsLoggedIn } from "../../utils/auth";

function Signup() {
    const nav = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const validationSchema = Yup.object().shape({
        mobileNumber: Yup.string()
            .matches(/^[0-9]+$/, "Only numbers are allowed")
            .min(10, "Mobile number must be 10  digits")
            .max(10, "Mobile number must be 10 digits")
            .required("Mobile number is required"),
        name: Yup.string().required("Name is required"),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required"),
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = (data) => {
        saveUser({
            mobileNumber: data.mobileNumber,
            name: data.name,
            password: data.password,
        });
        setIsLoggedIn(true);
        nav("/", { replace: true });
        window.location.reload(); // Reload to apply changes
    };

    const containerStyle = {
        width: "90%",
        backgroundColor: "var(--card-background)",
        padding: "30px",
        borderRadius: "20px",
        boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
        maxWidth: "400px",
        border: `1px solid var(--card-border)`,
        fontFamily: "var(--font-family)",
        color: "var(--primary-text)",
    };

    const inputStyle = {
        padding: "12px",
        borderRadius: "8px",
        border: `1px solid var(--input-border)`,
        backgroundColor: "var(--background)",
        color: "var(--primary-text)",
        outline: "none",
        width: "100%",
        fontSize: "14px",
    };

    const buttonStyle = {
        padding: "12px",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "var(--accent-primary)",
        color: "var(--button-text)",
        fontWeight: "bold",
        cursor: "pointer",
        width: "100%",
        marginTop: "10px",
        fontSize: "16px",
        transition: "background 0.2s ease",
    };

    const inputContainerStyle = { position: "relative", marginBottom: "15px" };
    const prefixStyle = {
        backgroundColor: "var(--background)",
        color: "var(--accent-primary)",
        padding: "12px",
        borderRadius: "8px 0 0 8px",
        border: `1px solid var(--input-border)`,
        borderRight: "none",
        fontWeight: "bold",
        fontSize: "14px",
    };
    const eyeStyle = {
        position: "absolute",
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        cursor: "pointer",
        transition: "transform 0.3s ease, opacity 0.3s ease",
        opacity: showPassword ? 1 : 0.7,
    };
    const linkStyle = { color: "var(--accent-primary)", textDecoration: "none" };
    const errorStyle = { color: "#ff4c4c", fontSize: "12px", marginBottom: "8px" };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <div style={containerStyle}>
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Sign Up</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                        <span style={prefixStyle}>+91</span>
                        <input
                            type="text"
                            placeholder="Mobile Number"
                            {...register("mobileNumber")}
                            style={{ ...inputStyle, borderRadius: "0 8px 8px 0" }}
                            onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ""))}
                        />
                    </div>
                    {errors.mobileNumber && <p style={errorStyle}>{errors.mobileNumber.message}</p>}

                    <div style={inputContainerStyle}>
                        <input type="text" placeholder="Name" {...register("name")} autoComplete="off" style={inputStyle} />
                    </div>
                    {errors.name && <p style={errorStyle}>{errors.name.message}</p>}

                    <div style={inputContainerStyle}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            {...register("password")}
                            style={inputStyle}
                            autoComplete="off"
                        />
                        <span
                            style={{
                                ...eyeStyle,
                                transform: showPassword
                                    ? "translateY(-50%) rotate(0deg)"
                                    : "translateY(-50%) rotate(180deg)",
                            }}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <svg width="22" height="22" fill="var(--primary-text)" viewBox="0 0 24 24">
                                    <path d="M12 4.5C7.305 4.5 3.133 7.516 1.5 12c1.633 4.484 5.805 7.5 10.5 7.5s8.867-3.016 10.5-7.5c-1.633-4.484-5.805-7.5-10.5-7.5zm0 12a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z" />
                                    <circle cx="12" cy="12" r="2.5" />
                                </svg>
                            ) : (
                                <svg width="22" height="22" fill="var(--primary-text)" viewBox="0 0 24 24">
                                    <path d="M12 5c-5 0-9.27 3.11-11 7 1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
                                    <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                </svg>
                            )}
                        </span>
                    </div>
                    {errors.password && <p style={errorStyle}>{errors.password.message}</p>}

                    <button type="submit" style={buttonStyle}>Sign Up</button>
                </form>
                <p style={{ textAlign: "center", marginTop: "15px", fontSize: "14px" }}>
                    Already have an account? <Link to="/" style={linkStyle}>Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;