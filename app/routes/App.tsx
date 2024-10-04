// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "~/routes/_index";
import Payment from "./Payment";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </Router>
  );
}

