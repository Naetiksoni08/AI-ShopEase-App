require("dotenv").config();
const connectdb = require('./config/db');
const ProductModel = require("./models/productSchema");
const UserModel = require('./models/User.models');

connectdb();

async function seedProducts() {
    const newProducts = [
        // --- GAMING (4 NEW ITEMS) ---
        {
            name: "VR Headset OLED",
            category: "Gaming",
            Image: "https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?w=1200&ar=16:9&fit=crop&q=80",
            price: 39999,
            description: "Next-gen virtual reality headset featuring 4K OLED displays, precise motion tracking, and spatial audio."
        },
        {
            name: "Arcade Fight Stick Controller",
            category: "Gaming",
            Image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&ar=16:9&fit=crop&q=80",
            price: 11999,
            description: "Tournament-grade arcade stick with Sanwa Denshi buttons and authentic joystick layout for fighting games."
        },
        {
            name: "Portable Handheld Gaming Console",
            category: "Gaming",
            Image: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=1200&ar=16:9&fit=crop&q=80",
            price: 42999,
            description: "High-performance handheld gaming PC running AAA titles smoothly with a high-refresh-rate touch screen."
        },
        {
            name: "RGB Gaming Soundbar",
            category: "Gaming",
            Image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=1200&ar=16:9&fit=crop&q=80",
            price: 6499,
            description: "Compact desktop soundbar with customizable RGB illumination, dual drivers, and multi-host Bluetooth switching."
        },

        // --- ELECTRONICS (4 NEW ITEMS) ---
        {
            name: "Smart OLED TV 55 Inch",
            category: "Electronics",
            Image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=1200&ar=16:9&fit=crop&q=80",
            price: 89999,
            description: "Stunning 4K OLED display with Dolby Vision, 120Hz refresh rate, and AI-powered picture processing."
        },
        {
            name: "Noise-Cancelling Over-Ear Headphones",
            category: "Electronics",
            Image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1200&ar=16:9&fit=crop&q=80",
            price: 19999,
            description: "Premium studio headphones featuring active noise cancellation, high-resolution audio codecs, and quick charging."
        },
        {
            name: "Mechanical Wireless Trackpad",
            category: "Electronics",
            Image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&ar=16:9&fit=crop&q=80",
            price: 7999,
            description: "Precision multi-touch wireless trackpad with haptic feedback engine and smooth glass surface."
        },
        {
            name: "Portable Projector 1080p",
            category: "Electronics",
            Image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&ar=16:9&fit=crop&q=80",
            price: 24999,
            description: "Compact mini projector featuring built-in speakers, auto-focus, keystone correction, and wireless casting."
        },

        // --- FASHION (4 NEW ITEMS) ---
        {
            name: "Chunky Platform Sneakers",
            category: "Fashion",
            Image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&ar=16:9&fit=crop&q=80",
            price: 4999,
            description: "Trendy platform lifestyle sneakers with responsive cushioning and bold retro design accents."
        },
        {
            name: "Water-Resistant Trench Coat",
            category: "Fashion",
            Image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=1200&ar=16:9&fit=crop&q=80",
            price: 8499,
            description: "Classic double-breasted trench coat with removable waist belt and storm flap protection."
        },
        {
            name: "Knit Oversized Cardigan",
            category: "Fashion",
            Image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1200&ar=16:9&fit=crop&q=80",
            price: 3299,
            description: "Cozy heavy-knit cardigan sweater made from soft wool-blend yarns with deep front pockets."
        },
        {
            name: "Slim Fit Chino Trousers",
            category: "Fashion",
            Image: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=1200&ar=16:9&fit=crop&q=80",
            price: 2499,
            description: "Stretch cotton chino pants crafted for flexible all-day comfort and effortless modern style."
        },

        // --- HOME (4 NEW ITEMS) ---
        {
            name: "Air Purifier HEPA Filter",
            category: "Home",
            Image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1200&ar=16:9&fit=crop&q=80",
            price: 11999,
            description: "3-stage True HEPA filtration system removing 99.97% of airborne dust, allergens, and odors."
        },
        {
            name: "Smart LED Floor Lamp",
            category: "Home",
            Image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1200&ar=16:9&fit=crop&q=80",
            price: 4999,
            description: "Dimmable corner standing lamp with millions of colors, voice control, and music sync modes."
        },
        {
            name: "Pour-Over Coffee Dripper Kit",
            category: "Home",
            Image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&ar=16:9&fit=crop&q=80",
            price: 2899,
            description: "Heat-resistant glass carafe with stainless steel reusable mesh filter for rich artisanal coffee."
        },
        {
            name: "Ergonomic Standing Desk Converter",
            category: "Home",
            Image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=1200&ar=16:9&fit=crop&q=80",
            price: 12499,
            description: "Height-adjustable dual-tier desk riser designed to transition smoothly between sitting and standing."
        },

        // --- ACCESSORIES (4 NEW ITEMS) ---
        {
            name: "Minimalist Leather Cardholder",
            category: "Accessories",
            Image: "https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=1200&ar=16:9&fit=crop&q=80",
            price: 999,
            description: "Ultra-thin genuine leather front-pocket wallet holding up to 6 cards and folded cash."
        },
        {
            name: "Classic Leather Belt",
            category: "Accessories",
            Image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=1200&ar=16:9&fit=crop&q=80",
            price: 1799,
            description: "Full-grain durable leather waist belt with brushed nickel buckle for formal or casual wear."
        },
        {
            name: "Canvas Messenger Tote Bag",
            category: "Accessories",
            Image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=1200&ar=16:9&fit=crop&q=80",
            price: 2999,
            description: "Heavy-duty canvas shoulder bag featuring reinforced stitching and a padded tablet sleeve."
        },
        {
            name: "Square Acetate Sunglasses",
            category: "Accessories",
            Image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1200&ar=16:9&fit=crop&q=80",
            price: 3499,
            description: "Handcrafted acetate frame sunglasses with dark polarized anti-glare lenses and UV400 protection."
        }
    ];

    try {
        const seller = await UserModel.findOne({ role: "seller" });

        if (!seller) {
            console.error("No seller account found. Register a seller account (role: 'seller') first.");
            process.exit(1);
        }

        const productsWithSeller = newProducts.map((p) => ({
            ...p,
            seller: seller._id,
        }));

        // Using insertMany instead of deleteMany to add these alongside existing products
        await ProductModel.insertMany(productsWithSeller);
        console.log(`Successfully added ${productsWithSeller.length} new unique products!`);
    } catch (error) {
        console.error("Error adding new products:", error);
    } finally {
        process.exit();
    }
}

seedProducts();