// Payment.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate(); // Tambahkan useNavigate untuk navigasi
  const { cart, totalAmount } = location.state || { cart: [], totalAmount: 0 };
  
  const [name, setName] = useState<string>("");
  const [method, setMethod] = useState<string>("cash");
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [customCash, setCustomCash] = useState<string>("");

  // Fungsi untuk mengatur nominal uang masuk
  const handleCashChange = (amount: number) => {
    setCashReceived(amount);
    setCustomCash(""); // Reset input custom jika memilih dari opsi
  };

  // Fungsi untuk mengatur nominal uang masuk manual
  const handleCustomCash = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomCash(e.target.value);
    setCashReceived(Number(e.target.value) || 0); // Pastikan nilai input dapat diubah ke angka
  };

  // Opsi untuk Uang Pas
  const handleExactAmount = () => {
    setCashReceived(totalAmount);
    setCustomCash(""); // Reset input custom jika memilih Uang Pas
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Arahkan ke halaman Receipt dengan data cart, totalAmount, name, method, dan cashReceived
    navigate("/receipt", {
      state: { cart, totalAmount, name, method, cashReceived },
    });
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">SwiftBill</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">customer name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="block w-full px-4 py-2 border rounded-md"
          >
            <option value="cash">Cash</option>
            <option value="credit">Credit Card</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Admission Fee</label>
          <div className="grid grid-cols-3 gap-2">
            {[5000, 10000, 20000, 50000, 100000].map((amount) => (
              <button
                key={amount}
                type="button"
                className={`px-4 py-2 border rounded-md ${cashReceived === amount ? 'bg-gray-300' : ''}`}
                onClick={() => handleCashChange(amount)}
              >
                Rp {amount.toLocaleString()}
              </button>
            ))}
            <button
              type="button"
              className={`px-4 py-2 border rounded-md ${cashReceived === totalAmount ? 'bg-gray-300' : ''}`}
              onClick={handleExactAmount}
            >
              Exact Money
            </button>
          </div>
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700">Another Nominal (Manually)</label>
            <input
              type="number"
              value={customCash}
              onChange={handleCustomCash}
              placeholder="Masukkan nominal uang"
              className="block w-full px-4 py-2 border rounded-md"
            />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Total: Rp {totalAmount.toLocaleString()}</h3>
        </div>
        <div>
          <h3 className="text-xl font-semibold">
          Admission Fee: Rp {cashReceived.toLocaleString()}
          </h3>
          <h3 className="text-xl font-semibold">
          Return: Rp {(cashReceived - totalAmount).toLocaleString()}
          </h3>
        </div>
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md"
        >
          Pay Now
        </button>
      </form>
    </div>
  );
}
