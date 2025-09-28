import React, { useState } from "react";
import { useChangePasswordMutation, useGetProfileByPhoneMutation } from "../../utils/apiSlice";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function ChangePassword() {
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [getProfileByPhone, { isLoading: isProfileLoading }] = useGetProfileByPhoneMutation();
  const [changePassword, { isLoading: isPasswordLoading }] = useChangePasswordMutation();

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await getProfileByPhone({ phone });
      setUserDetails({
        phone: response.data.phone,
        username: response.data.username,
        walletBalance: response.data.walletId.walletBalance,
      });
    } catch (err) {
      setError("Failed to fetch user details. Please check the phone number.");
    }
  };

  const navigateToWhatsApp = (phoneNumber, newPassword) => {
    const message = encodeURIComponent(`Your password has been changed successfully! and your new password is: ${newPassword}`);
    const url = `https://wa.me/91${phoneNumber}?text=${message}`;
    window.open(url, "_blank");
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await changePassword({ phone, newPassword }).unwrap();
      setSuccess("Password changed successfully!");
      navigateToWhatsApp(phone, newPassword); // Moved before clearing newPassword
      setNewPassword("");
    } catch (err) {
      setError("Failed to change password. Please try again.");
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "start" }} className="app-container">
      <div style={{
        backgroundColor: "var(--card-background)",
        border: "1px solid var(--card-border)",
        borderRadius: "8px",
        padding: "2rem",
        width: "90%",
        maxWidth: "700px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}>
        <h2 style={{
          fontSize: "1.5rem",
          fontWeight: "600",
          color: "var(--primary-text)",
          textAlign: "center",
        }}>
          Admin - Change Password
        </h2>

        {/* Phone Number Form */}
        <form onSubmit={handlePhoneSubmit} style={{ marginBottom: "1.5rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="phone"
              style={{
                display: "block",
                fontSize: "0.9rem",
                color: "var(--secondary-text)",
                marginBottom: "0.5rem",
              }}
            >
              Mobile Number
            </label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter mobile number"
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid var(--input-border)",
                borderRadius: "4px",
                fontSize: "1rem",
                color: "var(--primary-text)",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent-primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--input-border)")}
            />
          </div>
          <button
            type="submit"
            disabled={isProfileLoading}
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "var(--accent-primary)",
              color: "var(--button-text)",
              border: "none",
              borderRadius: "4px",
              fontSize: "1rem",
              fontWeight: "500",
              cursor: isProfileLoading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "var(--accent-hover)")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "var(--accent-primary)")}
          >
            {isProfileLoading ? "Loading..." : "Fetch User Details"}
          </button>
        </form>

        {/* User Details Display */}
        {userDetails && (
          <div style={{
            marginBottom: "1.5rem",
            padding: "1rem",
            border: "1px solid var(--card-border)",
            borderRadius: "4px",
            backgroundColor: "var(--background)",
          }}>
            <h3 style={{
              fontSize: "1.2rem",
              color: "var(--primary-text)",
              marginBottom: "0.5rem",
            }}>
              User Details
            </h3>
            <p style={{ color: "var(--secondary-text)", marginBottom: "0.25rem" }}>
              <strong>Phone:</strong> {userDetails.phone}
            </p>
            <p style={{ color: "var(--secondary-text)", marginBottom: "0.25rem" }}>
              <strong>Username:</strong> {userDetails.username}
            </p>
            <p style={{ color: "var(--success-currency)", marginBottom: "0.25rem" }}>
              <strong>Wallet Balance:</strong> ${userDetails.walletBalance}
            </p>
          </div>
        )}

        {/* Change Password Form */}
        {userDetails && (
          <form onSubmit={handlePasswordSubmit}>
            <div style={{ marginBottom: "1rem", position: "relative" }}>
              <label
                htmlFor="newPassword"
                style={{
                  display: "block",
                  fontSize: "0.9rem",
                  color: "var(--secondary-text)",
                  marginBottom: "0.5rem",
                }}
              >
                New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                style={{
                  width: "100%",
                  padding: "0.75rem 2.5rem 0.75rem 0.75rem", // Added paddingRight for icon
                  border: "1px solid var(--input-border)",
                  borderRadius: "4px",
                  fontSize: "1rem",
                  color: "var(--primary-text)",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent-primary)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--input-border)")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-10%)", // Adjusted for vertical centering
                  background: "transparent",
                  border: "none",
                  fontSize: "1rem",
                  cursor: "pointer",
                  color: "var(--secondary-text)",
                  opacity: isPasswordLoading ? 0.6 : 1,
                  pointerEvents: isPasswordLoading ? "none" : "auto",
                  display: "flex",
                  alignItems: "center",
                }}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <VisibilityOff style={{ fontSize: "1.25rem" }} /> : <Visibility style={{ fontSize: "1.25rem" }} />}
              </button>
            </div>
            <button
              type="submit"
              disabled={isPasswordLoading}
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: "var(--accent-secondary)",
                color: "var(--button-text)",
                border: "none",
                borderRadius: "4px",
                fontSize: "1rem",
                fontWeight: "500",
                cursor: isPasswordLoading ? "not-allowed" : "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "var(--accent-hover)")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "var(--accent-secondary)")}
            >
              {isPasswordLoading ? "Changing..." : "Change Password"}
            </button>
          </form>
        )}

        {/* Error and Success Messages */}
        {error && (
          <p style={{
            color: "#DC2626",
            fontSize: "0.9rem",
            marginTop: "1rem",
            textAlign: "center",
          }}>
            {error}
          </p>
        )}
        {success && (
          <p style={{
            color: "var(--success-currency)",
            fontSize: "0.9rem",
            marginTop: "1rem",
            textAlign: "center",
          }}>
            {success}
          </p>
        )}
      </div>
    </div>
  );
}

export default ChangePassword;