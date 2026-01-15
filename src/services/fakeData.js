// src/services/fakeData.js

export const fakeProducts = [
    {
        id: 1,
        name: "Fallback T-Shirt",
        description: "Used when API is down",
        category_id: 3,
        // your backend cart uses product_variant_id, so include variants
        variants: [
            { id: 101, sku: "TS-RED-M", price: 1999, attributes: { color: "red", size: "M" } },
        ],
        images: [{ url: "https://via.placeholder.com/300" }],
        price: 1999, // optional convenience
    },
];

export const fakeCart = {
    items: [
        // { id: "c1", product_variant_id: 101, quantity: 2 }
    ],
};

export const fakeReviewsByProductId = {
    // "1": [{ id: "r1", product_id: 1, rating: 5, comment: "Great!", created_at: "..." }]
};
