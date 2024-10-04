// Index.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Menambahkan Link untuk navigasi
import { db } from "firebaseConfig"; // Firebase config
import { collection, getDocs } from "firebase/firestore";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function Index() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  // Fetch data dari Firebase
  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "kasir"));
      const productList: Product[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        productList.push({
          id: doc.id,
          name: data.namaMenu,
          price: data.hargaMenu,
          image: data.gambarMenu,
          quantity: 1,
        });
      });
      setProducts(productList);
    };
    fetchProducts();
  }, []);

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

  const handleQuantityChange = (id: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: quantity } : item
      )
    );
  };

  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalAmount(total);
  }, [cart]);

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Program Kasir</h1>
      <ProductTable products={products} addToCart={addToCart} />
      <Cart
        cart={cart}
        handleQuantityChange={handleQuantityChange}
        totalAmount={totalAmount}
      />
      {cart.length > 0 && (
        <div className="text-right">
          <Link
            to="/payment"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md"
          >
            Bayar
          </Link>
        </div>
      )}
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
  totalAmount,
}: {
  cart: Product[];
  handleQuantityChange: (id: string, quantity: number) => void;
  totalAmount: number;
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
                <td className="px-6 py-4">Rp {(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="text-right mb-4">
        <h3 className="text-xl font-semibold">Total: Rp {totalAmount.toLocaleString()}</h3>
      </div>
    </div>
  );
};
