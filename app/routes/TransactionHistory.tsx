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
  const [todayTransactions, setTodayTransactions] = useState<Transaction[]>([]);
  const [previousTransactions, setPreviousTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentDay, setCurrentDay] = useState<string>("");

  // Fungsi untuk mendapatkan awal hari (00:00) dalam bentuk timestamp
  const getStartOfDayTimestamp = (date: Date): number => {
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return startOfDay.getTime();
  };

  // Fungsi untuk mengambil data transaksi
  const fetchTransactions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "transaksi"));
      const transactionList: Transaction[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        transactionList.push({
          id: doc.id,
          timestamp: data.timestamp || "Unknown Date",
          cart: data.cart || [], // Pastikan cart selalu array
          totalAmount: data.totalAmount || 0,
          customerName: data.customerName || "Unknown Customer",
          paymentMethod: data.paymentMethod || "Unknown Method",
        });
      });

      // Pisahkan transaksi berdasarkan hari ini dan sebelumnya
      const now = new Date();
      const startOfDay = getStartOfDayTimestamp(now);

      const today = transactionList.filter((transaction) => {
        const transactionTime = new Date(transaction.timestamp).getTime();
        return transactionTime >= startOfDay && transactionTime < startOfDay + 24 * 60 * 60 * 1000;
      });

      const previous = transactionList.filter((transaction) => {
        const transactionTime = new Date(transaction.timestamp).getTime();
        return transactionTime < startOfDay;
      });

      setTodayTransactions(today);
      setPreviousTransactions(previous);
      setCurrentDay(now.toDateString());
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
      <p className="text-gray-600 mb-4">Transactions for: {currentDay}</p>
      {loading ? (
        <p className="text-gray-500">Loading transactions...</p>
      ) : (
        <>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Today’s Transactions</h2>
          {todayTransactions.length === 0 ? (
            <p className="text-gray-500">No transactions available for today</p>
          ) : (
            <TransactionTable transactions={todayTransactions} />
          )}

          <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">Previous Transactions</h2>
          {previousTransactions.length === 0 ? (
            <p className="text-gray-500">No previous transactions available</p>
          ) : (
            <TransactionTable transactions={previousTransactions} />
          )}
        </>
      )}
    </div>
  );
}

function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  return (
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
  );
}
