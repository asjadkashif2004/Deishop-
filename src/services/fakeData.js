// src/services/fakeData.js

export const fakeProducts = [
    {
        id: 1,
        name: "Fallback T-Shirt",
        description: "Used when API is down. Premium cotton with a relaxed fit.",
        category_id: 3, // Clothing
        variants: [
            { id: 101, sku: "TS-RED-M", price: 1999, attributes: { color: "Red", size: "M" } },
            { id: 102, sku: "TS-BLK-L", price: 2099, attributes: { color: "Black", size: "L" } },
        ],
        images: [{ url: "https://colorfulstandard.com/cdn/shop/files/CS2056_Male_OversizedOrganicT-Shirt-DeepBlack_2_2adc696d-0930-4a7f-86b1-61ad0c6dc3e9.jpg?v=1745834597&width=3000" }],
        price: 1999,
    },

    {
        id: 2,
        name: "Minimal Sneakers",
        description: "Everyday sneakers with breathable mesh and cushioned sole.",
        category_id: 5, // Sneakers
        variants: [
            { id: 201, sku: "SN-WHT-42", price: 5499, attributes: { color: "White", size: 42 } },
            { id: 202, sku: "SN-BLK-43", price: 5499, attributes: { color: "Black", size: 43 } },
        ],
        images: [{ url: "https://static.wixstatic.com/media/06a717_b6eaba6615d44a3791993e81f5ac3659~mv2.jpg/v1/fill/w_480,h_320,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/06a717_b6eaba6615d44a3791993e81f5ac3659~mv2.jpg" }],
        price: 5499,
    },

    {
        id: 3,
        name: "Leather Hand Bag",
        description: "Elegant leather handbag for daily use or special occasions.",
        category_id: 2, // Handbag
        variants: [
            { id: 301, sku: "HB-BRN", price: 8999, attributes: { color: "Brown" } },
            { id: 302, sku: "HB-BLK", price: 9499, attributes: { color: "Black" } },
        ],
        images: [{ url: "data:image/jpeg;base64,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" }],
        price: 8999,
    },

    {
        id: 4,
        name: "Modern Office Chair",
        description: "Ergonomic chair with lumbar support and breathable fabric.",
        category_id: 1, // Furniture
        variants: [
            { id: 401, sku: "CH-GRY", price: 12999, attributes: { color: "Gray" } },
        ],
        images: [{ url: "https://i5.walmartimages.com/seo/Waleaf-Home-Office-Chair-400LBS-8Hours-Heavy-Duty-Design-Ergonomic-High-Back-Cushion-Lumbar-Back-Support-Computer-Desk-Chair-Big-Tall-Chair-Work_f07c1ce7-dc86-45c1-80a1-19dbba3daa12.b1aa76cd209ef87df25d2f81ac4820c9.jpeg" }],
        price: 12999,
    },

    {
        id: 5,
        name: "Smart Watch Pro",
        description: "Track fitness, notifications, and health metrics on the go.",
        category_id: 4, // Tech
        variants: [
            { id: 501, sku: "SW-BLK", price: 15999, attributes: { color: "Black" } },
            { id: 502, sku: "SW-SLV", price: 15999, attributes: { color: "Silver" } },
        ],
        images: [{ url: "https://images.priceoye.pk/zero-phantom-pro-smart-watch-pakistan-priceoye-t94na.jpg" }],
        price: 15999,
    },

    {
        id: 6,
        name: "Travel Backpack",
        description: "Lightweight backpack with multiple compartments for travel.",
        category_id: 6, // Travel
        variants: [
            { id: 601, sku: "BP-NVY", price: 6999, attributes: { color: "Navy" } },
        ],
        images: [{ url: "https://images.squarespace-cdn.com/content/v1/5f5b5edbf73b313ebc7f923a/1612226197246-DUQ4P7HQT1L0W7J4S36O/travel-photography-backup-photos.jpg" }],
        price: 6999,
    },

    {
        id: 7,
        name: "Productivity Notebook",
        description: "Hardcover notebook for notes, planning, and journaling.",
        category_id: 3, // Books
        variants: [
            { id: 701, sku: "NB-A5", price: 1299, attributes: { size: "A5" } },
            { id: 702, sku: "NB-A4", price: 1599, attributes: { size: "A4" } },
        ],
        images: [{ url: "https://prodimage.images-bn.com/pimages/9780991846221_p0_v11_s600x595.jpg" }],
        price: 1299,
    },
];

export const fakeCart = {
    items: [
        // example:
        // { id: "c1", product_variant_id: 101, quantity: 2 }
    ],
};

export const fakeReviewsByProductId = {
    "1": [
        { id: "r1", product_id: 1, rating: 5, comment: "Great quality!", created_at: "2024-01-10" },
        { id: "r2", product_id: 1, rating: 4, comment: "Nice fit.", created_at: "2024-01-12" },
    ],
    "2": [
        { id: "r3", product_id: 2, rating: 5, comment: "Super comfortable.", created_at: "2024-02-02" },
    ],
};
