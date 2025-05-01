import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Menggunakan useNavigate untuk navigasi
import { db } from "firebaseConfig"; // Pastikan file firebaseConfig.js sudah diatur dengan benar
import { collection, getDocs } from "firebase/firestore";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

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

interface IncomeByDate {
  [date: string]: number;
}

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [incomeByDate, setIncomeByDate] = useState<IncomeByDate>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [hideButtons, setHideButtons] = useState<boolean>(false); // State untuk menyembunyikan tombol
  const navigate = useNavigate();

  const fetchTransactions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "transaksi"));
      const transactionList: Transaction[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Transaction[];

      setTransactions(transactionList);

      const income: IncomeByDate = {};
      transactionList.forEach((transaction) => {
        const date = new Date(transaction.timestamp).toLocaleDateString();
        if (!income[date]) {
          income[date] = 0;
        }
        income[date] += transaction.totalAmount;
      });

      setIncomeByDate(income);
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

  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.timestamp).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(transaction);
    return acc;
  }, {} as { [date: string]: Transaction[] });

  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => {
    const dateA = new Date(a.split(" ").reverse().join(" "));
    const dateB = new Date(b.split(" ").reverse().join(" "));
    return dateB.getTime() - dateA.getTime();
  });

  const handlePrintByDate = async (date: string) => {
    setHideButtons(true); // Sembunyikan tombol sebelum mencetak
    const element = document.getElementById(`transactions-${date}`);
    if (!element) return;

    // Gunakan window.print untuk mencetak
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Transaction ${date}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f4f4f4; }
              h2 { text-align: center; }
            </style>
          </head>
          <body>
            <h2>Transaction History for ${date}</h2>
            ${element.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }

    setHideButtons(false); // Tampilkan kembali tombol setelah mencetak
  };

  const handleDownloadPDFByDate = async (date: string) => {
    setHideButtons(true); // Sembunyikan tombol sebelum mengunduh PDF
    const element = document.getElementById(`transactions-${date}`);
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Transaction_${date}.pdf`);

    setHideButtons(false); // Tampilkan kembali tombol setelah mengunduh PDF
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-4 sm:p-6 md:p-8 relative">
      {/* Tombol Back di pojok kiri atas */}
      {!hideButtons && (
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md"
        >
          Back
        </button>
      )}

      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Transaction History
      </h1>

      {sortedDates.map((date) => (
        <div key={date} id={`transactions-${date}`} className="w-full max-w-4xl mb-8 overflow-x-auto">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">{date}</h2>
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Customer Name</th>
                <th className="border border-gray-300 px-4 py-2">Payment Method</th>
                <th className="border border-gray-300 px-4 py-2">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {groupedTransactions[date].map((transaction) => (
                <tr key={transaction.id} className="text-gray-700">
                  <td className="border border-gray-300 px-4 py-2">{transaction.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{transaction.customerName}</td>
                  <td className="border border-gray-300 px-4 py-2">{transaction.paymentMethod}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    Rp {transaction.totalAmount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-semibold">
                <td colSpan={3} className="border border-gray-300 px-4 py-2 text-right">
                  Total Income
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  Rp {(incomeByDate[date] || 0).toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
          {!hideButtons && (
            <div className="flex justify-between mt-4">
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md"
              >
                Back
              </button>
              <button
                onClick={() => handlePrintByDate(date)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
              >
                Print Transactions for {date}
              </button>
              <button
                onClick={() => handleDownloadPDFByDate(date)}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md"
              >
                Download PDF
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
