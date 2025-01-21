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
      navigate("/login?redirectTo=/admin"); // Redirect to login page after successful logout
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Admin Page</h1>

      <button
        onClick={() => window.history.back()}
        className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md mb-4"
      >
        Back
      </button>

      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md mb-4 ml-4"
      >
        Logout
      </button>

      {notification && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg">
          {notification}
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          className="border p-2 rounded mb-2 mr-2"
        />
        <input
          type="text"
          placeholder="Price"
          value={newProduct.price === 0 ? "" : newProduct.price.toString()}
          onChange={(e) => {
        const input = e.target.value;
      // Hanya memperbarui state jika input adalah angka yang valid
          if (/^\d*$/.test(input)) {
      setNewProduct({ ...newProduct, price: Number(input || "0") });
    }
  }}
  className="border p-2 rounded mb-2 mr-2"
/>

        <input
          type="file"
          onChange={(e) =>
            setNewProduct({ ...newProduct, imageFile: e.target.files ? e.target.files[0] : null })
          }
          className="border p-2 rounded mb-2 mr-2"
        />
        <button
          onClick={handleAddProduct}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
        >
          Add Product
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Product List</h2>
        <table className="table-auto w-full mb-8">
          <thead>
            <tr className="text-left bg-gray-100 text-gray-700">
              <th className="px-6 py-3">Photo</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="px-6 py-4">
                  <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
                </td>
                <td className="px-6 py-4">
                  {editingProduct && editingProduct.id === product.id ? (
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="border p-2 rounded"
                    />
                  ) : (
                    product.name
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingProduct && editingProduct.id === product.id ? (
                  <input
                  type="text"
                  value={editingProduct?.price === 0 ? "" : editingProduct?.price.toString()}
                  onChange={(e) => {
                    const input = e.target.value;
                    if (/^\d*$/.test(input)) {
                      setEditingProduct({ ...editingProduct, price: Number(input || "0") });
                    }
                  }}
                  className="border p-2 rounded"
                />
                
                  ) : (
                    `Rp ${product.price.toLocaleString()}`
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingProduct && editingProduct.id === product.id ? (
                    <button
                      onClick={handleUpdateProduct}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded-md mr-2"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-1 px-3 rounded-md mr-2"
                    >
                      Edit
                    </button>
                  )}
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
