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
  const [deliveryTime, setDeliveryTime] = useState("ASAP");

  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

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
    message += `Name: ${name}\nPhone: ${phone}\nAddress: ${address}\nDelivery: ${deliveryTime}\nPayment: Cash on Delivery\n\nOrder:\n`;

    Object.values(cart).forEach((item) => {
      message += `- ${item.name} x${item.qty} (₹${item.price * item.qty})\n`;
    });

    message += `\nTotal: ₹${totalPrice}`;

    return `https://wa.me/919315113365?text=${encodeURIComponent(message)}`;
  };

  const handleOrder = () => {
    if (!name || !phone || !address) {
      setError("Please fill all details");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setError("Enter valid 10-digit phone number");
      return;
    }

    setError("");

    window.open(generateWhatsAppMessage(), "_blank");

    setCart({});
    localStorage.removeItem("cart");
    setShowCart(false);
    setName("");
    setPhone("");
    setAddress("");
  };

  const filteredProducts = products.filter(
    (item) =>
      (selectedCategory === "All" || item.category === selectedCategory) &&
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-red-50 min-h-screen font-sans">

      {/* STICKY HEADER */}
      <div className="sticky top-0 z-50 bg-red-300 shadow-md text-center py-4">
        <h1 className="text-2xl font-bold text-red-800">Neelu’s Kitchi’n</h1>
      </div>

      {/* TRUST */}
      <div className="flex justify-center gap-6 py-3 text-black font-medium text-sm">
        <span>❤️ Homemade</span>
        <span>🧼 Hygienic</span>
        <span>🌿 Fresh</span>
      </div>

      {!showCart && (
        <>
          {/* SEARCH */}
          <div className="px-4 mt-2">
            <input
              type="text"
              placeholder="Search food..."
              className="w-full p-3 border rounded-xl shadow text-black"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* CATEGORIES */}
          <div className="flex gap-2 px-4 py-3 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  selectedCategory === cat
                    ? "bg-red-600 text-white shadow"
                    : "bg-white text-black border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* PRODUCTS */}
          <div className="grid md:grid-cols-3 gap-5 px-4 pb-24">
            {filteredProducts.map((item) => {
              const qty = cart[item.name]?.qty || 0;

              return (
                <div key={item.name} className="bg-white rounded-2xl shadow-md overflow-hidden">

                  <img
                    src={`/images/${item.image}`}
                    className="w-full h-44 object-cover"
                    alt={item.name}
                  />

                  <div className="p-3">
                    <h3 className="text-black font-semibold">{item.name}</h3>
                    <p className="text-gray-500 text-sm">{item.category}</p>

                    <div className="flex justify-between items-center mt-2">
                      <p className="text-red-600 font-bold">₹{item.price}</p>

                      {qty === 0 ? (
                        <button onClick={() => addItem(item)} className="bg-red-600 text-white px-4 py-1 rounded-full text-sm">
                          Add
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
                          <button onClick={() => removeItem(item)}>-</button>
                          <span>{qty}</span>
                          <button onClick={() => addItem(item)}>+</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CART BAR */}
          {totalItems > 0 && (
            <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-4 flex justify-between items-center">
              <p>{totalItems} items | ₹{totalPrice}</p>
              <button onClick={() => setShowCart(true)} className="bg-red-600 px-6 py-2 rounded-full">
                View Cart →
              </button>
            </div>
          )}
        </>
      )}

      {/* CART */}
      {showCart && (
        <div className="p-4">
          <button onClick={() => setShowCart(false)} className="text-red-600 mb-3">← Back</button>

          <h2 className="text-black font-bold text-xl">Your Cart</h2>

          {Object.values(cart).map((item) => (
            <div key={item.name} className="flex justify-between text-black">
              <span>{item.name} x{item.qty}</span>
              <span>₹{item.price * item.qty}</span>
            </div>
          ))}

          <p className="text-red-700 font-bold mt-3">Total ₹{totalPrice}</p>

          <div className="mt-4 space-y-2">
            <input className="w-full border p-2 text-black" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
            <input className="w-full border p-2 text-black" placeholder="Phone" value={phone} onChange={(e)=>setPhone(e.target.value)} />
            <input className="w-full border p-2 text-black" placeholder="Address" value={address} onChange={(e)=>setAddress(e.target.value)} />

            <select className="w-full border p-2 text-black" value={deliveryTime} onChange={(e)=>setDeliveryTime(e.target.value)}>
              <option>ASAP</option>
              <option>Evening (6-9 PM)</option>
            </select>
          </div>

          {error && <p className="text-red-600 mt-2">{error}</p>}

          <button onClick={handleOrder} className="w-full bg-green-600 text-white py-3 rounded mt-4">
            Place Order (COD)
          </button>
        </div>
      )}
    </div>
  );
}