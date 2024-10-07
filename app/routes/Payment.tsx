// Payment.tsx
import { useLocation } from "react-router-dom";
import { useState } from "react";

export default function Payment() {
  const location = useLocation();
  const { cart, totalAmount } = location.state || { cart: [], totalAmount: 0 }; // Pastikan ada default value
  const [name, setName] = useState<string>("");
  const [method, setMethod] = useState<string>("cash");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Kirim data ke halaman Receipt atau proses pembayaran
    // ...
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Form Pembayaran</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nama Pelanggan</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Metode Pembayaran</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="block w-full px-4 py-2 border rounded-md"
          >
            <option value="cash">Tunai</option>
            <option value="credit">Kartu Kredit</option>
          </select>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Total: Rp {totalAmount.toLocaleString()}</h3>
        </div>
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md"
        >
          Bayar Sekarang
        </button>
      </form>
    </div>
  );
}
