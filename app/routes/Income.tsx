import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "firebaseConfig"; // Sesuaikan dengan path firebaseConfig Anda
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

// Registrasi komponen Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Transaction {
  id: string;
  timestamp: string;
  totalAmount: number;
}

export default function Income() {
  const [monthlyIncome, setMonthlyIncome] = useState<{ [month: string]: number }>({});
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTransactions = async () => {
    try {
      // Ambil semua dokumen dari koleksi "transaksi"
      const querySnapshot = await getDocs(collection(db, "transaksi"));
      const transactions: Transaction[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Transaction, "id">),
      }));

      // Hitung total penghasilan per bulan
      const income: { [month: string]: number } = {};
      transactions.forEach((transaction) => {
        const date = new Date(transaction.timestamp); // Konversi timestamp ke objek Date
        const month = date.toLocaleString("default", { month: "long", year: "numeric" }); // Format bulan: "January 2024"

        if (!income[month]) {
          income[month] = 0;
        }
        income[month] += transaction.totalAmount; // Tambahkan jumlah transaksi ke bulan terkait
      });

      setMonthlyIncome(income); // Update state dengan data penghasilan bulanan
    } catch (error) {
      console.error("Error fetching transactions: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-600 mt-10">Loading...</div>;
  }

  const months = Object.keys(monthlyIncome);
  const totals = Object.values(monthlyIncome);

  // Data untuk grafik
  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Penghasilan Bulanan (Rp)",
        data: totals,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };


  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
        legend: { position: 'top' }, // Gunakan nilai yang valid seperti "top", "bottom", dll.
        title: { display: true, text: "Grafik Penghasilan Bulanan" }
    },
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Penghasilan Bulanan</h1>

      <button
        onClick={() => window.history.back()}
        className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md mb-4"
      >
        Back
      </button>

      {/* Grafik batang */}
      <div className="mb-8">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Tabel penghasilan */}
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="border border-gray-300 px-4 py-2">Bulan</th>
            <th className="border border-gray-300 px-4 py-2">Total Penghasilan (Rp)</th>
          </tr>
        </thead>
        <tbody>
          {months.map((month, index) => (
            <tr key={month} className="text-gray-700">
              <td className="border border-gray-300 px-4 py-2">{month}</td>
              <td className="border border-gray-300 px-4 py-2">
                Rp {totals[index].toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
