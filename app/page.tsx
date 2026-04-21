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
  const [payment, setPayment] = useState("COD");

  const [error, setError] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [showQR, setShowQR] = useState(false);

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
    message += `Name: ${name}\nPhone: ${phone}\nAddress: ${address}\nDelivery: ${deliveryTime}\n\nOrder:\n`;

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

    if (payment === "UPI") {
      setShowQR(true);
    } else {
      window.open(generateWhatsAppMessage(), "_blank");
      clearAll();
    }
  };

  const confirmUPIOrder = () => {
    window.open(generateWhatsAppMessage(), "_blank");
    clearAll();
  };

  const clearAll = () => {
    setCart({});
    localStorage.removeItem("cart");
    setShowCart(false);
    setShowQR(false);
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
    <div className="bg-gradient-to-b from-red-50 to-red-100 min-h-screen font-sans">

      {/* HERO */}
      <section className="text-center py-16 bg-red-300">
        <h1 className="text-5xl font-bold text-red-800">Neelu’s Kitchi’n</h1>
        <p className="text-black">From Pickles to Plates — Everything Homemade ❤️</p>
      </section>

      {/* TRUST */}
      <div className="flex justify-center gap-6 py-4 text-black font-medium">
        <span>❤️ Homemade</span>
        <span>🧼 Hygienic</span>
        <span>🌿 Fresh</span>
      </div>

      {!showCart && (
        <>
          <div className="px-6">
            <input
              type="text"
              placeholder="Search..."
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

                  {/* ✅ IMAGE FIXED */}
                  <img
                    src={`/images/${item.image}`}
                    className="w-full aspect-[4/3] object-cover rounded-lg mb-3"
                    alt={item.name}
                  />

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

          {totalItems > 0 && (
            <div className="fixed bottom-0 left-0 right-0 bg-white p-4 flex justify-between">
              <p className="text-black font-bold">{totalItems} items | ₹{totalPrice}</p>
              <button onClick={() => setShowCart(true)} className="bg-red-600 text-white px-6 py-2 rounded">
                View Cart
              </button>
            </div>
          )}
        </>
      )}

      {/* CART */}
      {showCart && (
        <div className="p-6">
          <button onClick={() => setShowCart(false)} className="text-red-600 mb-4">← Back</button>

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

            <select className="w-full border p-2 text-black" value={payment} onChange={(e)=>setPayment(e.target.value)}>
              <option value="COD">Cash on Delivery</option>
              <option value="UPI">Pay via UPI</option>
            </select>
          </div>

          {error && <p className="text-red-600 mt-2">{error}</p>}

          <button onClick={handleOrder} className="w-full bg-green-600 text-white py-3 rounded mt-4">
            Proceed to Order
          </button>

          {/* QR */}
          {showQR && (
            <div className="mt-4 text-center">
              <p className="text-black mb-2 font-bold">Scan & Pay</p>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=9711262985@pthdfc`}
                className="mx-auto"
              />

              <button onClick={confirmUPIOrder} className="w-full bg-green-600 text-white py-2 mt-3 rounded">
                I have Paid, Continue
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}