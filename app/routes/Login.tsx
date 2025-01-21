import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const redirectTo = new URLSearchParams(location.search).get("redirectTo") || "/income";
      localStorage.setItem("sessionType", redirectTo); // Store session type in local storage
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        navigate(redirectTo); // Redirect to the intended page after successful login
      }, 2000); // Delay for 2 seconds to show the success message
    } catch (error) {
      setError("Failed to log in. Please check your credentials.");
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Login</h1>

      {/* Menampilkan pesan sukses */}
      {success && (
        <div className="text-green-500 mb-4 p-4 bg-green-100 rounded-lg">
          {success}
        </div>
      )}

      {/* Menampilkan pesan error */}
      {error && (
        <div className="text-red-500 mb-4 p-4 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border p-2 rounded mb-2 w-full"
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border p-2 rounded mb-4 w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md w-full"
        >
          Login
        </button>
      </form>

      {/* Tombol Kembali ke Halaman Index */}
      <div className="mt-6">
        <button
          onClick={() => navigate("/")}
          className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md w-full"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
