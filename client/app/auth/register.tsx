import InputFailed from "components/ui/InputFailed";
import { BASE_URL } from "constant/BasicUrl";
import { useAuthContext } from "context/auth/AuthContext";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      setError("Passwords do not match. Please correct the error.");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to register. Please try again.");
      }
      const token = await response.json();
      if (!token) {
        throw new Error("Incorrect token. Please try again.");
      }

      login(formData.email, token);
      navigate("/login");
    } catch (error) {
      console.error("Error submitting registration form:", error);
      setError("Registration failed. Please try again later.");
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Register
          </h2>

          <div className="flex items-center gap-x-2">
            <InputFailed
              title="First Name"
              label="first-Name"
              type="text"
              value={formData.firstName}
              action={(e: any) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />
            <InputFailed
              title="Last Name"
              label="last-Name"
              type="text"
              value={formData.lastName}
              action={(e: any) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
            />
          </div>
          <InputFailed
            title="Email"
            label="email"
            type="email"
            value={formData.email}
            action={(e: any) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <InputFailed
            title="Password"
            label="password"
            type="password"
            value={formData.password}
            action={(e: any) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <InputFailed
            title="confirmPassword"
            label="confirm-Password"
            type="password"
            value={confirmPassword}
            action={(e: any) => setConfirmPassword(e.target.value)}
          />
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign Up
            </button>
          </div>
          {/* Show error */}
          <p className="block text-center text-red-500">{error && error}</p>
          <div className="flex items-center mt-4 text-center">
            <p className="text-gray-600">I have an account? </p>
            <Link to="/login" className="text-blue-600 hover:underline">
              login an my account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
