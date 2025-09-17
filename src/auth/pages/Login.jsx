import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useState } from "react";
import { useLoginUserMutation } from "../../utils/apiSlice";
import { setToken } from "../../utils/auth";

function Login() {
  const nav = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");

  const [loginUser, { isLoading }] = useLoginUserMutation();

  const validationSchema = Yup.object().shape({
    mobileNumber: Yup.string()
      .matches(/^[0-9]+$/, "Only numbers are allowed")
      .min(10, "Mobile number must be 10 digits")
      .max(10, "Mobile number must be 10 digits")
      .required("Mobile number is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await loginUser({
        phone: data.mobileNumber,
        password: data.password,
      });
      setToken(res.data.token);
      window.location.reload();
      nav("/", { replace: true });
    } catch (err) {
      setAuthError(err?.data?.message || "Invalid credentials, try again");
    }
  };

  const navigateToWhatsApp = () => {
    const name = encodeURIComponent("Name: [Your_Name]");
    const phone = encodeURIComponent("Phone Number: [Your_Phone_Number]");
    const message = `${name}%0A${phone}`; // %0A is newline in URL encoding
    const url = `https://wa.me/919789619917?text=${message}`;
    window.open(url, "_blank");
  };



  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{
        width: "90%",
        backgroundColor: "var(--card-background)",
        padding: "30px",
        borderRadius: "20px",
        boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
        maxWidth: "400px",
        border: `1px solid var(--card-border)`,
        fontFamily: "var(--font-family)",
        color: "var(--primary-text)",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
            <span style={{
              backgroundColor: "var(--background)",
              color: "var(--accent-primary)",
              padding: "12px",
              borderRadius: "8px 0 0 8px",
              border: `1px solid var(--input-border)`,
              borderRight: "none",
              fontWeight: "bold",
              fontSize: "14px",
            }}>+91</span>
            <input
              type="text"
              placeholder="Mobile Number"
              {...register("mobileNumber")}
              style={{
                padding: "12px",
                borderRadius: "0 8px 8px 0",
                border: `1px solid var(--input-border)`,
                backgroundColor: "var(--background)",
                color: "var(--primary-text)",
                outline: "none",
                width: "100%",
                fontSize: "14px",
              }}
              onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ""))}
            />
          </div>
          {errors.mobileNumber && <p style={{ color: "#ff4c4c", fontSize: "12px", marginBottom: "8px" }}>{errors.mobileNumber.message}</p>}

          <div style={{ position: "relative", marginBottom: "15px" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: `1px solid var(--input-border)`,
                backgroundColor: "var(--background)",
                color: "var(--primary-text)",
                outline: "none",
                width: "100%",
                fontSize: "14px",
              }}
            />
            <span
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                transition: "transform 0.3s ease, opacity 0.3s ease",
                opacity: showPassword ? 1 : 0.7,
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
          {errors.password && <p style={{ color: "#ff4c4c", fontSize: "12px", marginBottom: "8px" }}>{errors.password.message}</p>}

          {authError && <p style={{ color: "#ff4c4c", fontSize: "14px", marginTop: "5px", textAlign: "center" }}>{authError}</p>}

          <div onClick={navigateToWhatsApp} style={{ display: "flex", justifyContent: "flex-end" }}>
            <span style={{
              color: "var(--accent-primary)", textDecoration: "none", fontSize: "14px", cursor: "pointer", display: "block"
            }}>Forgot password</span> </div>
          <button type="submit" style={{
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
          }} disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: "15px", fontSize: "14px" }}>
          Don't have an account? <Link to="/signup" style={{ color: "var(--accent-primary)", textDecoration: "none" }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
