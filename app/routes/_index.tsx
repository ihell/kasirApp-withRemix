import { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const products: Product[] = [
  { id: 1, name: "Produk A", price: 10000, image: "/images/product-a.jpg", quantity: 1 },
  { id: 2, name: "Produk B", price: 20000, image: "/images/product-b.jpg", quantity: 1 },
];

export default function Index() {
  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existingProduct = prev.find((item) => item.id === product.id);
      if (existingProduct) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, product];
    });
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: quantity } : item
      )
    );
  };

  const handleCheckout = () => {
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    alert(`Total pembayaran: Rp ${totalAmount}`);
    setCart([]);
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Program Kasir</h1>
      <ProductTable products={products} addToCart={addToCart} />
      <Cart cart={cart} handleQuantityChange={handleQuantityChange} handleCheckout={handleCheckout} />
    </div>
  );
}

const ProductTable = ({ products, addToCart }: { products: Product[]; addToCart: (product: Product) => void }) => {
  return (
    <table className="table-auto w-full mb-8">
      <thead>
        <tr className="text-left bg-gray-100 text-gray-700">
          <th className="px-6 py-3">Foto</th>
          <th className="px-6 py-3">Nama Produk</th>
          <th className="px-6 py-3">Harga</th>
          <th className="px-6 py-3">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id} className="border-t">
            <td className="px-6 py-4">
              <img src={product.image} alt={product.name} className="w-32 h-32 object-cover rounded-md" />
            </td>
            <td className="px-6 py-4">{product.name}</td>
            <td className="px-6 py-4">Rp {product.price.toLocaleString()}</td>
            <td className="px-6 py-4">
              <button
                onClick={() => addToCart(product)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
              >
                Tambah ke Keranjang
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const Cart = ({
  cart,
  handleQuantityChange,
  handleCheckout,
}: {
  cart: Product[];
  handleQuantityChange: (id: number, quantity: number) => void;
  handleCheckout: () => void;
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Keranjang</h2>
      {cart.length === 0 ? (
        <p className="text-gray-500">Keranjang kosong</p>
      ) : (
        <table className="table-auto w-full mb-8">
          <thead>
            <tr className="text-left bg-gray-100 text-gray-700">
              <th className="px-6 py-3">Foto</th>
              <th className="px-6 py-3">Nama Produk</th>
              <th className="px-6 py-3">Jumlah</th>
              <th className="px-6 py-3">Harga Total</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-6 py-4">
                  <img src={item.image} alt={item.name} className="w-32 h-32 object-cover rounded-md" />
                </td>
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, +e.target.value)}
                    className="w-16 text-center border rounded-md"
                    min="1"
                  />
                </td>
                <td className="px-6 py-4">Rp {item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button
        onClick={handleCheckout}
        disabled={cart.length === 0}
        className={`${cart.length === 0 ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          } text-white font-semibold py-2 px-4 rounded-md`}
      >
        Bayar
      </button>
    </div>
  );
};

