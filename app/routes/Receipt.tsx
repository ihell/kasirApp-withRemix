// Receipt.tsx
import { useLocation } from "react-router-dom";

export default function Receipt() {
  const location = useLocation();
  const { cart, totalAmount, name, method } = location.state || {
    cart: [],
    totalAmount: 0,
    name: "",
    method: "",
  };

  // Fungsi untuk mencetak nota
  const handlePrint = () => {
    window.print();
  };

  // Mendapatkan tanggal dan waktu sekarang
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = currentDate.toLocaleTimeString("id-ID");

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg max-w-md">
      <div className="bg-white p-4 border-2 border-gray-300 rounded-lg">
        {/* Header Nota */}
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold">NOTA PEMBAYARAN</h1>
          <p className="text-sm">Minimarket Teyvat</p>
          <p className="text-sm">Jl. Gi No. 10</p>
          <p className="text-sm">Telp: (021) 12345678</p>
          {/* Menampilkan tanggal dan waktu */}
          <p className="text-sm mt-2">{formattedDate}, {formattedTime}</p>
        </div>

        {/* Informasi Pembeli */}
        <div className="mb-4">
          <p className="font-mono text-sm">Nama Pelanggan: {name}</p>
          <p className="font-mono text-sm">Metode Pembayaran: {method}</p>
        </div>

        {/* Tabel Produk */}
        <table className="table-auto w-full mb-4 font-mono text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Produk</th>
              <th className="py-2 text-center">Jumlah</th>
              <th className="py-2 text-right">Harga</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item: any) => (
              <tr key={item.id} className="border-b">
                <td className="py-1">{item.name}</td>
                <td className="py-1 text-center">{item.quantity}</td>
                <td className="py-1 text-right">Rp {item.price.toLocaleString()}</td>
                <td className="py-1 text-right">
                  Rp {(item.price * item.quantity).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total Pembayaran */}
        <div className="border-t border-gray-400 py-2">
          <h3 className="font-mono text-sm font-semibold text-right">
            Total: Rp {totalAmount.toLocaleString()}
          </h3>
        </div>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="text-xs font-mono">Terima kasih atas kunjungannya!</p>
          <p className="text-xs font-mono">Barang yang sudah dibeli tidak dapat dikembalikan.</p>
        </div>
      </div>

      {/* Tombol Print */}
      <div className="text-center mt-4">
        <button
          onClick={handlePrint}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
        >
          Print Nota
        </button>
      </div>
    </div>
  );
}
