// Payment.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Untuk navigasi balik

export default function Payment() {
  const [name, setName] = useState<string>("");
  const [method, setMethod] = useState<string>("cash");
  const [totalAmount] = useState<number>(100000); // Ini contoh, ambil data dari state atau URL
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Pembayaran Berhasil!\nNama: ${name}\nMetode: ${method}\nTotal: Rp ${totalAmount}`);
    navigate("/"); // Kembali ke halaman utama setelah pembayaran
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
