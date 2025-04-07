import React, { useState, useEffect } from 'react';
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
import { useNavigate } from "react-router-dom";

// Registrasi komponen Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Transaction {
  id: string;
  timestamp: string;
  totalAmount: number;
}

export default function Income() {
  const [income, setIncome] = useState<number>(0);
  const [monthlyIncome, setMonthlyIncome] = useState<{ [month: string]: number }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch income data from your database or API
    const fetchIncome = async () => {
      // Example fetch logic
      const response = await fetch('/api/income');
      const data = await response.json();
      setIncome(data.totalIncome);
    };

    fetchIncome();
  }, []);

  useEffect(() => {
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
      legend: { position: "top" }, // Gunakan nilai yang valid seperti "top", "bottom", dll.
      title: { display: true, text: "Grafik Penghasilan Bulanan" },
    },
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-4 sm:p-6 md:p-8 relative">
      {/* Tombol Back di pojok kiri atas */}
      <button
        onClick={() => window.history.back()}
        className="absolute top-4 left-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md"
      >
        Back
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Income Overview
      </h1>

      {/* Total Income */}
      <div className="w-full max-w-4xl bg-gray-100 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Income</h2>
        <p className="text-2xl font-bold text-green-600">Rp {income.toLocaleString()}</p>
      </div>

      {/* Grafik batang */}
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Monthly Income Chart</h2>
        <div className="overflow-x-auto">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Tabel penghasilan */}
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Monthly Income Table</h2>
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border border-gray-300 px-4 py-2">Month</th>
              <th className="border border-gray-300 px-4 py-2">Total Income (Rp)</th>
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
    </div>
  );
}
