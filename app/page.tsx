"use client";
import { useState } from "react";

type Product = {
  name: string;
  category: string;
  price: number;
  image: string;
};

type CartItem = Product & {
  qty: number;
};

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<Record<string, CartItem>>({});

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
    if (updated[item.name]) {
      updated[item.name].qty += 1;
    } else {
      updated[item.name] = { ...item, qty: 1 };
    }
    setCart(updated);
  };

  const removeItem = (item: Product) => {
    const updated = { ...cart };
    if (updated[item.name].qty > 1) {
      updated[item.name].qty -= 1;
    } else {
      delete updated[item.name];
    }
    setCart(updated);
  };

  const totalItems = Object.values(cart).reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = Object.values(cart).reduce((sum, i) => sum + i.qty * i.price, 0);

  const generateWhatsAppMessage = () => {
    let message = "Hi, I want to order:\n";
    Object.values(cart).forEach((item) => {
      message += `- ${item.name} x${item.qty} (₹${item.price * item.qty})\n`;
    });
    message += `Total: ₹${totalPrice}`;
    return `https://wa.me/919315113365?text=${encodeURIComponent(message)}`;
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

      {/* SEARCH */}
      <div className="px-6 mt-6">
        <input
          type="text"
          placeholder="Search your favorite food..."
          className="w-full p-3 rounded-xl border shadow"
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
      <section className="px-6 pb-28">
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

      {/* CART */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg px-6 py-4 flex justify-between items-center">

          <div>
            <p className="text-black font-bold text-lg">
              {totalItems} items
            </p>
            <p className="text-red-700 font-bold text-lg">
              ₹{totalPrice}
            </p>
          </div>

          <a
            href={generateWhatsAppMessage()}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Order via WhatsApp
          </a>

        </div>
      )}

      {/* FLOATING WHATSAPP */}
      <a
        href="https://wa.me/919315113365"
        className="fixed bottom-24 right-5 bg-green-500 text-white px-5 py-3 rounded-full shadow-lg"
      >
        WhatsApp
      </a>

    </div>
  );
}