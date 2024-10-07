// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "~/routes/_index";
import Payment from "./Payment";
import Receipt from "./Receipt";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/receipt" element={<Receipt />} />
      </Routes>
    </Router>
  );
}
