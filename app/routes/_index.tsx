import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "firebaseConfig";
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
  const [menuOpen, setMenuOpen] = useState(false); // State untuk kontrol menu
  const navigate = useNavigate();

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

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalAmount(total);
  }, [cart]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-4 sm:p-6 md:p-8">
      {/* Header dengan ikon menu */}
      <div className="w-full max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <button
            className="text-gray-800 text-3xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            &#9776; {/* Ikon garis tiga (hamburger) */}
          </button>
          <h1 className="text-4xl font-bold text-gray-800">SwiftBill</h1>
        </div>

        {/* Menu dropdown dengan efek transisi */}
        <div
          className={`absolute bg-white shadow-lg rounded-lg p-4 left-0 top-15 z-10 transform transition-all duration-300 ease-in-out ${
            menuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
          }`}
        >
          <button
            onClick={() => {
              setMenuOpen(false);
              navigate("./Admin");
            }}
            className="block text-gray-800 hover:bg-gray-200 px-4 py-2 rounded-md"
          >
            Admin Page
          </button>
        </div>

        {/* Tabel Produk */}
        <div className="overflow-x-auto w-full">
          <ProductTable products={products} addToCart={addToCart} />
        </div>

        {/* Keranjang */}
        <div className="overflow-x-auto w-full mt-8">
          <Cart
            cart={cart}
            handleQuantityChange={handleQuantityChange}
            removeFromCart={removeFromCart}
            totalAmount={totalAmount}
          />
        </div>

        {/* Tombol Pay */}
        {cart.length > 0 && (
          <div className="text-right mt-4">
            <Link
              to={{
                pathname: "/payment",
              }}
              state={{ cart: cart, totalAmount: totalAmount }}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md"
            >
              Pay
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

const Footer = () => {
  return (
    <footer className="text-black text-center py-4 mt-8">
      <p>&copy; {new Date().getFullYear()} SwiftBill. All rights reserved.</p>
      <p>
        Made with ❤️ by <a href="https://porto-sv.vercel.app/" className="text-blue-400 hover:underline">Ram Akasaka</a>
      </p>
    </footer>
  );
};

const ProductTable = ({ products, addToCart }: { products: Product[]; addToCart: (product: Product) => void }) => {
  return (
    <table className="table-auto w-full mb-8">
      <thead>
        <tr className="text-left bg-gray-100 text-gray-700">
          <th className="px-6 py-3">Photo</th>
          <th className="px-6 py-3">Name Product</th>
          <th className="px-6 py-3">Price</th>
          <th className="px-6 py-3">Action</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id} className="border-t">
            <td className="px-6 py-4">
              <div className="w-32 h-32 rounded-md overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </td>
            <td className="px-6 py-4">{product.name}</td>
            <td className="px-6 py-4">Rp {product.price.toLocaleString()}</td>
            <td className="px-6 py-4">
              <button
                onClick={() => addToCart(product)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
              >
                Buy
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
  removeFromCart,
  totalAmount,
}: {
  cart: Product[];
  handleQuantityChange: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  totalAmount: number;
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Cart</h2>
      {cart.length === 0 ? (
        <p className="text-gray-500">Empty</p>
      ) : (
        <table className="table-auto w-full mb-8">
          <thead>
            <tr className="text-left bg-gray-100 text-gray-700">
              <th className="px-6 py-3">Photo</th>
              <th className="px-6 py-3">Name Product</th>
              <th className="px-6 py-3">Amout</th>
              <th className="px-6 py-3">Total Price</th>
              <th className="px-6 py-3">Action</th>
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
                <td className="px-6 py-4">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="text-right mb-4">
        <h3 className="text-xl font-semibold">Total: Rp {totalAmount.toLocaleString()}</h3>
       <Footer />
      </div>
    </div>
  );
};
