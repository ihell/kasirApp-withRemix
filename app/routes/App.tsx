// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "~/routes/_index"; // Menyesuaikan path impor
import Payment from "./Payment";
import Receipt from "./Receipt";
import Login from "./Login"; // Menambahkan halaman login
import Admin from "./Admin"; // Menambahkan halaman admin
import TransactionHistory from "./TransactionHistory";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/receipt" element={<Receipt />} />
        <Route path="/transaction-history" element={<TransactionHistory />} />;
      </Routes>
    </Router>
  );
}
