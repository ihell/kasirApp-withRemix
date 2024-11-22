import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default function Receipt() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, totalAmount, name, method, cashReceived } = location.state || {
    cart: [],
    totalAmount: 0,
    name: "",
    method: "",
    cashReceived: 0,
  };

  const change = cashReceived - totalAmount;

  const handlePrint = () => {
    window.print();
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const generatePDF = async () => {
    const receiptElement = document.getElementById("receipt-content");
    if (!receiptElement) return;

    const canvas = await html2canvas(receiptElement);
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
    pdf.save("receipt.pdf");
  };

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
      <div id="receipt-content" className="bg-white p-4 border-2 border-gray-300 rounded-lg">
        {/* Header Nota */}
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold">SwiftBill</h1>
          <p className="text-sm">Minimarket Teyvat</p>
          <p className="text-sm">Jl. Gi No. 10</p>
          <p className="text-sm">Telp: (021) 12345678</p>
          <p className="text-sm mt-2">{formattedDate}, {formattedTime}</p>
        </div>

        {/* Informasi Pembeli */}
        <div className="mb-4">
          <p className="font-mono text-sm">Customer Name: {name}</p>
          <p className="font-mono text-sm">Payment Method: {method}</p>
        </div>

        {/* Tabel Produk */}
        <table className="table-auto w-full mb-4 font-mono text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Product</th>
              <th className="py-2 text-center">Amount</th>
              <th className="py-2 text-right">Price</th>
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

        {/* Informasi Uang Masuk dan Kembalian */}
        <div className="border-t border-gray-400 py-2">
          <h3 className="font-mono text-sm font-semibold text-right">
            Admission Fee: Rp {cashReceived.toLocaleString()}
          </h3>
          <h3 className="font-mono text-sm font-semibold text-right">
            Return: Rp {change > 0 ? change.toLocaleString() : 0}
          </h3>
        </div>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="text-xs font-mono">Thank you For Visiting!</p>
          <p className="text-xs font-mono">Goods That Have Been Purchased Cannot Be Returned.</p>
        </div>
      </div>

      {/* Tombol Print dan Tombol Back */}
      <div className="flex justify-between mt-4">
        <button
          onClick={handleGoBack}
          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md"
        >
          Back
        </button>
        <button
          onClick={handlePrint}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
        >
          Print Note
        </button>
        <button
          onClick={generatePDF}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}
