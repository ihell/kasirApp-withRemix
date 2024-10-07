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

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Nota Pembayaran</h1>
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Terima kasih, {name}!</h2>
        <p className="text-gray-600">Pembayaran Anda telah berhasil diproses.</p>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold">Metode Pembayaran: {method}</h3>
        <h3 className="text-xl font-semibold">Total Pembayaran: Rp {totalAmount.toLocaleString()}</h3>
      </div>

      <div className="mb-4">
        <h2 className="text-2xl font-bold">Detail Pembelian</h2>
        <table className="table-auto w-full mb-4">
          <thead>
            <tr className="text-left bg-gray-100 text-gray-700">
              <th className="px-6 py-3">Nama Produk</th>
              <th className="px-6 py-3">Jumlah</th>
              <th className="px-6 py-3">Harga Satuan</th>
              <th className="px-6 py-3">Harga Total</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item: any) => (
              <tr key={item.id} className="border-t">
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4">{item.quantity}</td>
                <td className="px-6 py-4">Rp {item.price.toLocaleString()}</td>
                <td className="px-6 py-4">
                  Rp {(item.price * item.quantity).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-right">
        <h3 className="text-xl font-semibold">Total: Rp {totalAmount.toLocaleString()}</h3>
      </div>
    </div>
  );
}
