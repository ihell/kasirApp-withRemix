import { useState, useEffect } from "react";
import { db, storage } from "firebaseConfig"; // Pastikan path firebaseConfig benar
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function Admin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<{ name: string; price: number; imageFile: File | null }>({
    name: "",
    price: 0,
    imageFile: null,
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [logoutMessage, setLogoutMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false); // state untuk kontrol menu
  const [showMenu, setShowMenu] = useState(false); // state untuk menampilkan menu
  const navigate = useNavigate();
  const auth = getAuth();

  // Memeriksa status login pengguna
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login"); // Jika tidak ada pengguna, arahkan ke halaman login
      } else {
        setIsAuthenticated(true); // Pengguna sudah login
      }
    });

    return () => unsubscribe(); // Bersihkan listener saat komponen dihapus
  }, [auth, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return; // Jika belum login, jangan ambil data produk

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
  }, [isAuthenticated]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000); // Notifikasi akan hilang dalam 3 detik
  };

  const handleAddProduct = async () => {
    if (newProduct.name && newProduct.price && newProduct.imageFile) {
      const imageRef = ref(storage, `kasir/${newProduct.imageFile.name}`);
      await uploadBytes(imageRef, newProduct.imageFile);
      const imageUrl = await getDownloadURL(imageRef);

      const docRef = await addDoc(collection(db, "kasir"), {
        namaMenu: newProduct.name,
        hargaMenu: newProduct.price,
        gambarMenu: imageUrl,
      });

      setProducts([...products, { id: docRef.id, name: newProduct.name, price: newProduct.price, image: imageUrl, quantity: 1 }]);
      setNewProduct({ name: "", price: 0, imageFile: null });
      showNotification("Product added successfully!");
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = async () => {
    if (editingProduct) {
      const docRef = doc(db, "kasir", editingProduct.id);
      await updateDoc(docRef, {
        namaMenu: editingProduct.name,
        hargaMenu: editingProduct.price,
        gambarMenu: editingProduct.image,
      });
      setProducts(products.map((product) =>
        product.id === editingProduct.id ? editingProduct : product
      ));
      setEditingProduct(null);
      showNotification("Product updated successfully!");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const docRef = doc(db, "kasir", id);
    await deleteDoc(docRef);
    setProducts(products.filter((product) => product.id !== id));
    showNotification("Product deleted successfully!");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("sessionType"); // Remove session type from local storage
      setLogoutMessage("Logout successful! Redirecting...");
      setTimeout(() => {
        navigate("/login?redirectTo=/admin"); // Redirect to login page after successful logout
      }, 2000); // Delay for 2 seconds to show the logout message
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="relative w-full max-w-6xl">
        {/* Menu Hamburger */}
        <button
          className="absolute top-4 right-4 flex flex-col justify-center items-center w-8 h-8 bg-transparent border-none cursor-pointer"
          onClick={() => setShowMenu(!showMenu)}
        >
          <span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
          <span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
          <span className="block w-6 h-0.5 bg-gray-700"></span>
        </button>

        {/* Dropdown Menu */}
        <div
          className={`absolute top-16 right-4 bg-white shadow-md rounded-md w-48 z-10 transition-all duration-300 ease-in-out ${
            showMenu ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
          }`}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
          <ul className="flex flex-col">
            <li>
              <button
                onClick={() => navigate("/TransactionHistory")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Transaction History
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/Income")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Income
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Admin Page</h1>

      {/* Buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => navigate("/")}
          className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md"
        >
          Back
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md"
        >
          Logout
        </button>
      </div>

      {/* Notification */}
      {logoutMessage && <p className="text-green-600 mb-4">{logoutMessage}</p>}
      {notification && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg">
          {notification}
        </div>
      )}

      {/* Add New Product */}
      <div className="w-full max-w-4xl mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Price"
            value={newProduct.price === 0 ? "" : newProduct.price.toString()}
            onChange={(e) => {
              const input = e.target.value;
              if (/^\d*$/.test(input)) {
                setNewProduct({ ...newProduct, price: Number(input || "0") });
              }
            }}
            className="border p-2 rounded"
          />
          <input
            type="file"
            onChange={(e) =>
              setNewProduct({ ...newProduct, imageFile: e.target.files ? e.target.files[0] : null })
            }
            className="border p-2 rounded"
          />
          <button
            onClick={handleAddProduct}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
          >
            Add Product
          </button>
        </div>
      </div>

      {/* Product List */}
      <div className="w-full max-w-6xl overflow-x-auto">
        <h2 className="text-2xl font-semibold mb-4">Product List</h2>
        <table className="table-auto w-full mb-8 border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border border-gray-300 px-4 py-2">Photo</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Price</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="border border-gray-300 px-4 py-2">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                <td className="border border-gray-300 px-4 py-2">
                  Rp {product.price.toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-1 px-3 rounded-md mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}