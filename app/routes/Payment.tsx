import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "firebaseConfig"; // Pastikan path firebaseConfig benar

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, totalAmount } = location.state || { cart: [], totalAmount: 0 };

  const [name, setName] = useState<string>("");
  const [method, setMethod] = useState<string>("cash");
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [customCash, setCustomCash] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // State untuk mencegah submit ganda

  const handleCashChange = (amount: number) => {
    setCashReceived(amount);
    setCustomCash(""); // Reset input custom jika memilih dari opsi
  };

  const handleCustomCash = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomCash(e.target.value);
    setCashReceived(Number(e.target.value) || 0); // Pastikan nilai input dapat diubah ke angka
  };

  const handleExactAmount = () => {
    setCashReceived(totalAmount);
    setCustomCash(""); // Reset input custom jika memilih Uang Pas
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Cegah pengiriman ganda jika transaksi sedang diproses
    if (loading) return;

    // Set loading ke true saat proses dimulai
    setLoading(true);

    try {
      const transactionData = {
        customerName: name,
        paymentMethod: method,
        totalAmount,
        cashReceived,
        change: cashReceived - totalAmount,
        cart,
        timestamp: new Date().toISOString(),
      };

      // Tambahkan transaksi ke Firestore
      await addDoc(collection(db, "transaksi"), transactionData);

      // Navigasi ke halaman Receipt setelah transaksi berhasil
      navigate("/receipt", {
        state: { cart, totalAmount, name, method, cashReceived },
      });
    } catch (error) {
      console.error("Failed to save transaction: ", error);
      alert("Failed to process transaction. Please try again.");
    } finally {
      // Pastikan loading diatur kembali ke false
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1); // Kembali ke halaman sebelumnya
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">SwiftBill</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Customer Name</label>
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
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleGoBack}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading} // Tombol tidak aktif saat loading
            className={`font-semibold py-2 px-4 rounded-md ${
              loading
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </form>
    </div>
  );
}
