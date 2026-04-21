"use client";
import { useState, useEffect } from "react";

type Product = {
  name: string;
  category: string;
  price: number;
  image: string;
};

type CartItem = Product & { qty: number };

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [showCart, setShowCart] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  // Load cart from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  // Save cart
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const products: Product[] = [
    { name: "Rajma Chawal", category: "Meals", price: 120, image: "rajmachawal.jpg" },
    { name: "Chole Bhature", category: "Meals", price: 100, image: "cholebhature.jpg" },
    { name: "Veg Biryani", category: "Meals", price: 130, image: "vegbiryani.jpg" },
    { name: "Kachori", category: "Snacks", price: 20, image: "kachori.jpg" },
    { name: "Papad", category: "Snacks", price: 10, image: "papad.jpg" },
    { name: "Aam Pickle", category: "Pickles", price: 150, image: "aampickle.jpg" },
  ];

  const categories = ["All", "Meals", "Snacks", "Pickles"];

  const addItem = (item: Product) => {
    const updated = { ...cart };
    if (updated[item.name]) updated[item.name].qty += 1;
    else updated[item.name] = { ...item, qty: 1 };
    setCart(updated);
  };

  const removeItem = (item: Product) => {
    const updated = { ...cart };
    if (updated[item.name].qty > 1) updated[item.name].qty -= 1;
    else delete updated[item.name];
    setCart(updated);
  };

  const totalItems = Object.values(cart).reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = Object.values(cart).reduce((sum, i) => sum + i.qty * i.price, 0);

  const generateWhatsAppMessage = () => {
    let message = "Hi, I want to order:\n\n";
    message += `Name: ${name}\nPhone: ${phone}\nAddress: ${address}\n\nOrder:\n`;

    Object.values(cart).forEach((item) => {
      message += `- ${item.name} x${item.qty} (₹${item.price * item.qty})\n`;
    });

    message += `\nTotal: ₹${totalPrice}`;

    return `https://wa.me/919315113365?text=${encodeURIComponent(message)}`;
  };

  // ✅ FIXED VALIDATION FUNCTION
  const handleOrder = () => {
    if (!name || !phone || !address) {
      setError("Please fill all details");
      return;
    }

    setError("");

    const url = generateWhatsAppMessage();
    window.open(url, "_blank");
  };

  const filteredProducts = products.filter(
    (item) =>
      (selectedCategory === "All" || item.category === selectedCategory) &&
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-b from-red-50 to-red-100 min-h-screen font-sans">

      {/* HERO */}
      <section className="text-center py-16 px-4 bg-red-300 shadow-md">
        <h1 className="text-5xl font-extrabold text-red-800">
          Neelu’s Kitchi’n
        </h1>
        <p className="mt-3 text-lg text-black">
          From Pickles to Plates — Everything Homemade ❤️
        </p>
      </section>

      {!showCart && (
        <>
          {/* SEARCH */}
          <div className="px-6 mt-6">
            <input
              type="text"
              placeholder="Search your favorite food..."
              className="w-full p-3 rounded-xl border shadow text-black"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* CATEGORIES */}
          <section className="flex gap-3 px-6 py-6 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full font-semibold ${
                  selectedCategory === cat
                    ? "bg-red-600 text-white"
                    : "bg-white text-black border"
                }`}
              >
                {cat}
              </button>
            ))}
          </section>

          {/* PRODUCTS */}
          <section className="px-6 pb-32">
            <div className="grid md:grid-cols-3 gap-6">
              {filteredProducts.map((item) => {
                const qty = cart[item.name]?.qty || 0;

                return (
                  <div key={item.name} className="bg-red-100 p-4 rounded-2xl shadow">

                    <img
                      src={`/images/${item.image}`}
                      className="h-44 w-full object-cover rounded-lg mb-3"
                      alt={item.name}
                    />

                    <h3 className="text-lg font-bold text-black">{item.name}</h3>
                    <p className="text-sm text-black">{item.category}</p>
                    <p className="font-bold text-red-700">₹{item.price}</p>

                    {qty === 0 ? (
                      <button
                        onClick={() => addItem(item)}
                        className="mt-3 w-full bg-red-600 text-white py-2 rounded-lg"
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <div className="flex justify-between items-center mt-3 bg-red-600 text-white rounded-lg px-4 py-2">
                        <button onClick={() => removeItem(item)}>-</button>
                        <span className="font-bold">{qty}</span>
                        <button onClick={() => addItem(item)}>+</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* VIEW CART */}
          {totalItems > 0 && (
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg px-6 py-4 flex justify-between items-center">
              <p className="text-black font-bold text-lg">
                {totalItems} items | ₹{totalPrice}
              </p>

              <button
                onClick={() => setShowCart(true)}
                className="bg-red-600 text-white px-6 py-2 rounded-lg"
              >
                View Cart
              </button>
            </div>
          )}
        </>
      )}

      {/* CART PAGE */}
      {showCart && (
        <div className="p-6">
          <button onClick={() => setShowCart(false)} className="mb-4 text-red-600">
            ← Back
          </button>

          <h2 className="text-2xl font-bold text-black mb-4">Your Cart</h2>

          {Object.values(cart).map((item) => (
            <div key={item.name} className="flex justify-between mb-2 text-black">
              <span>{item.name} x{item.qty}</span>
              <span>₹{item.price * item.qty}</span>
            </div>
          ))}

          <p className="font-bold text-red-700 mt-3">Total: ₹{totalPrice}</p>

          {/* FORM */}
          <div className="mt-4 space-y-2">
            <input
              placeholder="Name"
              className="w-full border p-2 text-black"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              placeholder="Phone"
              className="w-full border p-2 text-black"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              placeholder="Address"
              className="w-full border p-2 text-black"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* ERROR */}
          {error && (
            <p className="text-red-600 mt-2">{error}</p>
          )}

          {/* BUTTON (VALIDATION WORKS NOW) */}
          <button
            onClick={handleOrder}
            className="block w-full text-center bg-green-600 text-white py-3 rounded mt-4"
          >
            Confirm Order
          </button>
        </div>
      )}
    </div>
  );
}