// Admin.tsx
import { useState, useEffect } from "react";
import { db, storage } from "firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function Admin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", imageFile: null });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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

  const handleAddProduct = async () => {
    if (newProduct.name && newProduct.price && newProduct.imageFile) {
      // Upload image to Firebase Storage
      const imageRef = ref(storage, `images/${newProduct.imageFile.name}`);
      await uploadBytes(imageRef, newProduct.imageFile);
      const imageUrl = await getDownloadURL(imageRef);

      const docRef = await addDoc(collection(db, "kasir"), {
        namaMenu: newProduct.name,
        hargaMenu: parseFloat(newProduct.price),
        gambarMenu: imageUrl,
      });

      setProducts([...products, { ...newProduct, id: docRef.id, image: imageUrl, quantity: 1 }]);
      setNewProduct({ name: "", price: "", imageFile: null });
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
        hargaMenu: parseFloat(editingProduct.price.toString()),
        gambarMenu: editingProduct.image,
      });
      setProducts(products.map((product) =>
        product.id === editingProduct.id ? editingProduct : product
      ));
      setEditingProduct(null);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const docRef = doc(db, "kasir", id);
    await deleteDoc(docRef);
    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Admin Page</h1>

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
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
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
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: +e.target.value })}
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
