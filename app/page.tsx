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
  const [showCart, setShowCart] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

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

  const filteredProducts = products.filter(
    (item) =>
      (selectedCategory === "All" || item.category === selectedCategory) &&
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-red-50 min-h-screen font-sans">

      {/* HERO */}
      <section className="text-center py-16 bg-red-300">
        <h1 className="text-5xl font-bold text-red-800">Neelu’s Kitchi’n</h1>
        <p className="text-black mt-2">Everything Homemade ❤️</p>
      </section>

      {/* MAIN */}
      {!showCart && (
        <>
          <div className="px-6 mt-6">
            <input
              type="text"
              placeholder="Search food..."
              className="w-full p-3 border rounded text-black"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-3 px-6 py-4 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded ${
                  selectedCategory === cat ? "bg-red-600 text-white" : "bg-white text-black border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6 px-6 pb-24">
            {filteredProducts.map((item) => {
              const qty = cart[item.name]?.qty || 0;

              return (
                <div key={item.name} className="bg-red-100 p-4 rounded-xl">
                  <img src={`/images/${item.image}`} className="h-40 w-full object-cover rounded mb-2" />
                  <h3 className="text-black font-bold">{item.name}</h3>
                  <p className="text-black">{item.category}</p>
                  <p className="text-red-700 font-bold">₹{item.price}</p>

                  {qty === 0 ? (
                    <button onClick={() => addItem(item)} className="bg-red-600 text-white w-full mt-2 py-2 rounded">
                      Add to Cart
                    </button>
                  ) : (
                    <div className="flex justify-between mt-2 bg-red-600 text-white px-3 py-2 rounded">
                      <button onClick={() => removeItem(item)}>-</button>
                      <span>{qty}</span>
                      <button onClick={() => addItem(item)}>+</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* VIEW CART BUTTON */}
          {totalItems > 0 && (
            <div className="fixed bottom-0 left-0 right-0 bg-white p-4 flex justify-between">
              <p className="text-black font-bold">{totalItems} items | ₹{totalPrice}</p>
              <button
                onClick={() => setShowCart(true)}
                className="bg-red-600 text-white px-6 py-2 rounded"
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
            <input placeholder="Name" className="w-full border p-2 text-black" value={name} onChange={(e)=>setName(e.target.value)} />
            <input placeholder="Phone" className="w-full border p-2 text-black" value={phone} onChange={(e)=>setPhone(e.target.value)} />
            <input placeholder="Address" className="w-full border p-2 text-black" value={address} onChange={(e)=>setAddress(e.target.value)} />
          </div>

          <a
            href={generateWhatsAppMessage()}
            className="block text-center bg-green-600 text-white py-3 rounded mt-4"
          >
            Confirm Order on WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}