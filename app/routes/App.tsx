// App.tsx
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import Index from "~/routes/_index"; // Menyesuaikan path impor
import Payment from "./Payment";
import Receipt from "./Receipt";
import Login from "./Login"; // Menambahkan halaman login
import Admin from "./Admin"; // Menambahkan halaman admin
import Income from "./Income";
import TransactionHistory from "./TransactionHistory";

export default function App() {
  const auth = getAuth();
  const user = auth.currentUser;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/income"
          element={user ? <Income /> : <Navigate to="/login?redirectTo=/income" />}
        />
        <Route
          path="/admin"
          element={user ? <Admin /> : <Navigate to="/login?redirectTo=/admin" />}
        />
        <Route path="/payment" element={<Payment />} />
        <Route path="/receipt" element={<Receipt />} />
        <Route path="/transaction-history" element={<TransactionHistory />} />
      </Routes>
    </Router>
  );
}
