import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "firebaseConfig"; // Pastikan path firebaseConfig benar
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // Menambahkan state untuk mode daftar
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // State untuk notifikasi sukses
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccessMessage("Login successful! Redirecting to admin page...");
      setTimeout(() => {
        navigate("/admin"); // Arahkan ke halaman admin setelah 2 detik
      }, 2000);
    } catch (err) {
      setError("Login failed. Please check your email and password.");
      setSuccessMessage(null); // Reset pesan sukses
    }
  };

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccessMessage("Sign up successful! Redirecting to admin page...");
      setTimeout(() => {
        navigate("/admin"); // Arahkan ke halaman admin setelah 2 detik
      }, 2000);
    } catch (err) {
      setError("Sign up failed. Please try again.");
      setSuccessMessage(null); // Reset pesan sukses
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        {isRegistering ? "Sign Up" : "Login"}
      </h1>

      {/* Menampilkan pesan sukses */}
      {successMessage && (
        <div className="text-green-500 mb-4 p-4 bg-green-100 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Menampilkan pesan error */}
      {error && (
        <div className="text-red-500 mb-4 p-4 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded mb-2 w-full"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded mb-4 w-full"
      />
      <button
        onClick={isRegistering ? handleSignUp : handleLogin}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md w-full"
      >
        {isRegistering ? "Sign Up" : "Login"}
      </button>
      <div className="mt-4 text-center">
        {isRegistering ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => {
                setIsRegistering(false);
                setError(null); // Reset error saat mode berubah
                setSuccessMessage(null); // Reset pesan sukses saat mode berubah
              }}
              className="text-blue-600 cursor-pointer"
            >
              Login
            </span>
          </p>
        ) : (
          <p>
            Don’t have an account?{" "}
            <span
              onClick={() => {
                setIsRegistering(true);
                setError(null); // Reset error saat mode berubah
                setSuccessMessage(null); // Reset pesan sukses saat mode berubah
              }}
              className="text-blue-600 cursor-pointer"
            >
              Sign Up
            </span>
          </p>
        )}
      </div>

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
