require("dotenv").config();
const connectdb = require('./config/db');
const ProductModel = require("./models/productSchema");

connectdb();
async function seedProducts() {

    const products = [
        {
            name: "Apple iPad Pro 12.9",
            Image:
                "https://images.unsplash.com/photo-1690220928782-29e2295bae30?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fEFwcGxlJTIwaVBhZCUyMFBybyUyMDEyLjklMjJ8ZW58MHx8MHx8fDA%3D",
            price: 105000,
            description:
                "Apple’s most powerful tablet featuring the M2 chip, Liquid Retina XDR display, ProMotion 120Hz, and Apple Pencil support."
        },
        {
            name: "Gaming Keyboard",
            Image:
                "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Z2FtaW5nJTIwa2V5Ym9hcmR8ZW58MHx8MHx8fDA%3D",
            price: 2500,
            description:
                "Mechanical RGB gaming keyboard with customizable lighting, anti-ghosting keys, and durable switches built for long gaming sessions."
        },
        {
            name: "Boat Bluetooth Earbuds",
            Image:
                "https://images.unsplash.com/photo-1655560378428-7605bda51749?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Ymx1ZXRvb3RoJTIwZWFyYnVkc3xlbnwwfHwwfHx8MA%3D%3D",
            price: 1800,
            description:
                "Lightweight true wireless earbuds featuring noise isolation, touch controls, and a compact charging case."
        },
        {
            name: "Apple Watch",
            Image:
                "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXBwbGUlMjB3YXRjaHxlbnwwfHwwfHx8MA%3D%3D",
            price: 35000,
            description:
                "Fitness-focused smartwatch with heart-rate monitoring, step tracking, AMOLED display, and seamless smartphone connectivity."
        },
        {
            name: "Sony Controller",
            Image:
                "https://images.unsplash.com/photo-1526509867162-5b0c0d1b4b33?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            price: 8500,
            description:
                "Ziria Foldable Toy Drone with HQ WiFi Camera Remote Control for Kids Quadcopter with Gesture Selfie, Flips Bounce Mode,",
        },

        {
            name: "Iphone 15 Pro Max",
            Image:
                "https://images.unsplash.com/photo-1695639509828-d4260075e370?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGlwaG9uZSUyMDE1JTIwcHJvJTIwbWF4fGVufDB8fDB8fHww",
            price: 80000,
            description:
                "Experience Apple’s most advanced flagship yet, featuring the powerful A17 Pro chip, a stunning Super Retina XDR display, and a durable titanium design.",
        },
        {
            name: "DJI Drone",
            Image:
                "https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHJvbmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
            price: 20000,
            description:
                "Ziria Foldable Toy Drone with HQ WiFi Camera Remote Control for Kids Quadcopter with Gesture Selfie, Flips Bounce Mode,",
        },
        {
            name: "PlayStation 5",
            Image:
                "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHM1fGVufDB8fDB8fHww",
            price: 55000,
            description:
                "Experience ultra-fast gaming with the PlayStation 5 powered by the custom AMD Ryzen processor, ray tracing support, 4K HDR gaming, and a super-speed SSD for near-instant load times. Comes with the new DualSense controller for immersive haptic feedback."
        },
        {
            name: "Apple AirPod Max",
            Image:
                "https://media.istockphoto.com/id/2242429885/photo/pair-of-stylish-pink-headphones-on-light-blue-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=FZ_2Vg0yWXOSSXLairCbFCVTu5sv3t8PYXMaq7QmCIQ=",
            price: 6500,
            description:
                "Stylish and lightweight Nike Air Max sneakers featuring iconic Air cushioning, breathable mesh design, and all-day comfort for everyday wear."
        },
        {
            name: "Macbook M2",
            Image:
                "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFjYm9va3xlbnwwfHwwfHx8MA%3D%3D",
            price: 120000,
            description:
                "Ziria Foldable Toy Drone with HQ WiFi Camera Remote Control for Kids Quadcopter with Gesture Selfie, Flips Bounce Mode,",
        },
        {
            name: "Titan Watch",
            Image:
                "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8d2F0Y2h8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
            price: 3200,
            description:
                "Ziria Foldable Toy Drone with HQ WiFi Camera Remote Control for Kids Quadcopter with Gesture Selfie, Flips Bounce Mode,",
        },
        {
            name: "Boat Headphones",
            Image:
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
            price: 4500,
            description:
                "Ziria Foldable Toy Drone with HQ WiFi Camera Remote Control for Kids Quadcopter with Gesture Selfie, Flips Bounce Mode,",
        },
    ]


    await ProductModel.deleteMany({});
    await ProductModel.create(products);
    console.log("products seeded successfully!");
}

seedProducts();
