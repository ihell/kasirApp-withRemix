import { useEffect, useState } from "react";
import { db } from "firebaseConfig"; // Pastikan file firebaseConfig.js sudah diatur dengan benar
import { collection, getDocs } from "firebase/firestore";

interface Item {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Transaction {
  id: string;
  timestamp: string;
  cart: Item[];
  totalAmount: number;
  customerName: string;
  paymentMethod: string;
}

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fungsi untuk mengambil data transaksi
  const fetchTransactions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "transaksi"));
      const transactionList: Transaction[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log("Data Dokumen:", data); // Debugging
        transactionList.push({
          id: doc.id,
          timestamp: data.timestamp || "Unknown Date",
          cart: data.cart || [], // Pastikan cart selalu array
          totalAmount: data.totalAmount || 0,
          customerName: data.customerName || "Unknown Customer",
          paymentMethod: data.paymentMethod || "Unknown Method",
        });
      });
      setTransactions(transactionList);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Transaction History</h1>
      {loading ? (
        <p className="text-gray-500">Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <p className="text-gray-500">No transactions available</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border border-gray-300 px-6 py-3">Timestamp</th>
              <th className="border border-gray-300 px-6 py-3">Customer</th>
              <th className="border border-gray-300 px-6 py-3">Items</th>
              <th className="border border-gray-300 px-6 py-3">Total Amount</th>
              <th className="border border-gray-300 px-6 py-3">Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-t">
                <td className="border border-gray-300 px-6 py-4">
                  {new Date(transaction.timestamp).toLocaleString()}
                </td>
                <td className="border border-gray-300 px-6 py-4">{transaction.customerName}</td>
                <td className="border border-gray-300 px-6 py-4">
                  {transaction.cart.map((item, index) => (
                    <div key={index}>
                      {item.name} x{item.quantity} @ Rp {item.price.toLocaleString()}
                    </div>
                  ))}
                </td>
                <td className="border border-gray-300 px-6 py-4">
                  Rp {transaction.totalAmount.toLocaleString()}
                </td>
                <td className="border border-gray-300 px-6 py-4">{transaction.paymentMethod}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
