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
  // Tambahkan produk lain sesuai kebutuhan
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
    <div className="container">
      <h1>Program Kasir</h1>
      <ProductTable products={products} addToCart={addToCart} />
      <Cart cart={cart} handleQuantityChange={handleQuantityChange} handleCheckout={handleCheckout} />
    </div>
  );
}

const ProductTable = ({ products, addToCart }: { products: Product[]; addToCart: (product: Product) => void }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Foto</th>
          <th>Nama Produk</th>
          <th>Harga</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>
              <img src={product.image} alt={product.name} style={{ width: "100px" }} />
            </td>
            <td>{product.name}</td>
            <td>Rp {product.price}</td>
            <td>
              <button onClick={() => addToCart(product)}>Tambah ke Keranjang</button>
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
    <div>
      <h2>Keranjang</h2>
      {cart.length === 0 ? (
        <p>Keranjang kosong</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nama Produk</th>
              <th>Jumlah</th>
              <th>Harga Total</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id}>
                <td>
                  <img src={item.image} alt={item.name} style={{ width: "100px" }} />
                </td>
                <td>{item.name}</td>
                <td>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, +e.target.value)}
                    min="1"
                  />
                </td>
                <td>Rp {item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={handleCheckout} disabled={cart.length === 0}>
        Bayar
      </button>
    </div>
  );
};
