import InputFailed from "components/ui/InputFailed";
import { BASE_URL } from "constant/BasicUrl";
import { useAuthContext } from "context/auth/AuthContext";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

export default function Login() {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        setError(errorMessage.message || "Failed to login. Please try again.");
        return;
      }

      const token = await response.json();

      if (!token) {
        setError("Incorrect token. Please try again.");
        return;
      }

      login(formData.email, token);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputFailed
            title="Email"
            label="email"
            type="email"
            value={formData.email}
            action={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <InputFailed
            title="Password"
            label="password"
            type="password"
            value={formData.password}
            action={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Login
          </button>
        </form>
        {error && <p className="block text-center text-red-500">{error}</p>}
        <div className="flex items-center mt-4 text-center">
          <p className="text-gray-600">Don't have an account? </p>
          <Link to="/register" className="text-blue-600 hover:underline">
            Create new account
          </Link>
        </div>
      </div>
    </div>
  );
}
