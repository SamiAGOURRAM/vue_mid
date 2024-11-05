const firebase = require("firebase/app");
require("firebase/firestore");
const admin = require("firebase-admin");

// Firebase client configuration remains the same
const firebaseConfig = {
  apiKey: "AIzaSyBufLc1UQozgL6FkhEzgmtZ52Ba9BXYKig",
  authDomain: "tp6-forum-37a15.firebaseapp.com",
  projectId: "tp6-forum-37a15",
  storageBucket: "tp6-forum-37a15.appspot.com",
  messagingSenderId: "424450261076",
  appId: "1:424450261076:web:82393593b12e285da12dc1"
};

// Initialize Firebase and Firestore
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Expanded ingredients data
const ingredientsData = [
  // Previous ingredients
  { name: "Eggs", nutrients: { calories: 155, proteins: 13, carbs: 1.1, fats: 11, fiber: 0 }, unit: "pieces" },
  { name: "Chicken Breast", nutrients: { calories: 165, proteins: 31, carbs: 0, fats: 3.6, fiber: 0 }, unit: "g" },
  { name: "Beef", nutrients: { calories: 250, proteins: 26, carbs: 0, fats: 15, fiber: 0 }, unit: "g" },
  { name: "Salmon", nutrients: { calories: 208, proteins: 20, carbs: 0, fats: 13, fiber: 0 }, unit: "g" },
  { name: "Broccoli", nutrients: { calories: 55, proteins: 3.7, carbs: 11.2, fats: 0.6, fiber: 3.8 }, unit: "g" },
  
  // Grains and Starches
  { name: "White Rice", nutrients: { calories: 130, proteins: 2.7, carbs: 28, fats: 0.3, fiber: 0.4 }, unit: "g" },
  { name: "Pasta", nutrients: { calories: 158, proteins: 6, carbs: 31, fats: 0.9, fiber: 1.8 }, unit: "g" },
  { name: "Bread Flour", nutrients: { calories: 364, proteins: 10, carbs: 76, fats: 1, fiber: 2.7 }, unit: "g" },
  { name: "Couscous", nutrients: { calories: 112, proteins: 3.8, carbs: 23, fats: 0.2, fiber: 1.4 }, unit: "g" },
  { name: "Oats", nutrients: { calories: 389, proteins: 16.9, carbs: 66, fats: 6.9, fiber: 10.6 }, unit: "g" },

  // Proteins
  { name: "Pork", nutrients: { calories: 242, proteins: 26, carbs: 0, fats: 14, fiber: 0 }, unit: "g" },
  { name: "Tofu", nutrients: { calories: 76, proteins: 8, carbs: 1.9, fats: 4.8, fiber: 0.3 }, unit: "g" },
  { name: "Shrimp", nutrients: { calories: 99, proteins: 24, carbs: 0, fats: 0.3, fiber: 0 }, unit: "g" },
  { name: "Tuna", nutrients: { calories: 144, proteins: 30, carbs: 0, fats: 1, fiber: 0 }, unit: "g" },
  { name: "Black Beans", nutrients: { calories: 132, proteins: 8.9, carbs: 23.7, fats: 0.5, fiber: 8.7 }, unit: "g" },

  // Vegetables
  { name: "Zucchini", nutrients: { calories: 17, proteins: 1.2, carbs: 3.1, fats: 0.3, fiber: 1 }, unit: "g" },
  { name: "Mushrooms", nutrients: { calories: 22, proteins: 3.1, carbs: 3.3, fats: 0.3, fiber: 1 }, unit: "g" },
  { name: "Onion", nutrients: { calories: 40, proteins: 1.1, carbs: 9.3, fats: 0.1, fiber: 1.7 }, unit: "g" },
  { name: "Garlic", nutrients: { calories: 149, proteins: 6.4, carbs: 33, fats: 0.5, fiber: 2.1 }, unit: "g" },
  { name: "Cauliflower", nutrients: { calories: 25, proteins: 1.9, carbs: 5, fats: 0.3, fiber: 2.5 }, unit: "g" },

  // Fruits
  { name: "Lemon", nutrients: { calories: 29, proteins: 1.1, carbs: 9.3, fats: 0.3, fiber: 2.8 }, unit: "g" },
  { name: "Lime", nutrients: { calories: 30, proteins: 0.7, carbs: 10.5, fats: 0.2, fiber: 2.8 }, unit: "g" },
  { name: "Pineapple", nutrients: { calories: 50, proteins: 0.5, carbs: 13, fats: 0.1, fiber: 1.4 }, unit: "g" },
  { name: "Mango", nutrients: { calories: 60, proteins: 0.8, carbs: 15, fats: 0.4, fiber: 1.6 }, unit: "g" },

  // Dairy and Alternatives
  { name: "Heavy Cream", nutrients: { calories: 340, proteins: 2.8, carbs: 2.8, fats: 36, fiber: 0 }, unit: "ml" },
  { name: "Butter", nutrients: { calories: 717, proteins: 0.9, carbs: 0.1, fats: 81, fiber: 0 }, unit: "g" },
  { name: "Sour Cream", nutrients: { calories: 193, proteins: 2.1, carbs: 4.6, fats: 18, fiber: 0 }, unit: "g" },
  { name: "Coconut Milk", nutrients: { calories: 230, proteins: 2.3, carbs: 5.5, fats: 24, fiber: 0 }, unit: "ml" },

  // Herbs and Spices
  { name: "Basil", nutrients: { calories: 23, proteins: 3.2, carbs: 2.7, fats: 0.6, fiber: 1.6 }, unit: "g" },
  { name: "Oregano", nutrients: { calories: 265, proteins: 9, carbs: 69, fats: 4, fiber: 42 }, unit: "g" },
  { name: "Cinnamon", nutrients: { calories: 247, proteins: 4, carbs: 81, fats: 1.2, fiber: 53 }, unit: "g" },
  { name: "Cumin", nutrients: { calories: 375, proteins: 18, carbs: 44, fats: 22, fiber: 10 }, unit: "g" },
  { name: "Paprika", nutrients: { calories: 282, proteins: 14.1, carbs: 54, fats: 13, fiber: 34.9 }, unit: "g" },

  // Pantry Staples
  { name: "Soy Sauce", nutrients: { calories: 53, proteins: 8.1, carbs: 4.9, fats: 0, fiber: 0.8 }, unit: "ml" },
  { name: "Honey", nutrients: { calories: 304, proteins: 0.3, carbs: 82, fats: 0, fiber: 0.2 }, unit: "g" },
  { name: "Maple Syrup", nutrients: { calories: 260, proteins: 0, carbs: 67, fats: 0, fiber: 0 }, unit: "ml" },
  { name: "Tomato Paste", nutrients: { calories: 82, proteins: 4.3, carbs: 19, fats: 0.5, fiber: 4.1 }, unit: "g" },
  { name: "Vinegar", nutrients: { calories: 21, proteins: 0, carbs: 0.9, fats: 0, fiber: 0 }, unit: "ml" },

  // Nuts and Seeds
  { name: "Walnuts", nutrients: { calories: 654, proteins: 15, carbs: 14, fats: 65, fiber: 6.7 }, unit: "g" },
  { name: "Chia Seeds", nutrients: { calories: 486, proteins: 17, carbs: 42, fats: 31, fiber: 34 }, unit: "g" },
  { name: "Pumpkin Seeds", nutrients: { calories: 559, proteins: 30, carbs: 11, fats: 49, fiber: 6 }, unit: "g" },
  { name: "Sesame Seeds", nutrients: { calories: 573, proteins: 17, carbs: 23, fats: 50, fiber: 12 }, unit: "g" },

  // Legumes
  { name: "Lentils", nutrients: { calories: 116, proteins: 9, carbs: 20, fats: 0.4, fiber: 7.9 }, unit: "g" },
  { name: "Chickpeas", nutrients: { calories: 164, proteins: 8.9, carbs: 27, fats: 2.6, fiber: 7.6 }, unit: "g" },
  { name: "Kidney Beans", nutrients: { calories: 127, proteins: 8.7, carbs: 22.8, fats: 0.5, fiber: 6.4 }, unit: "g" },
  { name: "Pinto Beans", nutrients: { calories: 143, proteins: 9, carbs: 26, fats: 0.7, fiber: 9 }, unit: "g" }
];

// Diets data remains the same
const dietsData = [
  { name: "Keto", description: "Low carb, high fat diet." },
  { name: "Vegan", description: "Excludes all animal products." },
  { name: "Paleo", description: "Focuses on whole foods and excludes processed foods." },
  { name: "Mediterranean", description: "Rich in vegetables, fruits, legumes, nuts, and whole grains." },
  { name: "Gluten-Free", description: "Excludes gluten-containing grains." },
  { name: "Low-Carb", description: "Limits carbohydrates and focuses on high-protein foods." },
  { name: "High-Protein", description: "High in protein, often with a focus on lean meats and legumes." }
];

async function populateCollection(collectionName, data) {
  const batch = db.batch();
  data.forEach((item) => {
    const docRef = db.collection(collectionName).doc();
    batch.set(docRef, item);
  });

  await batch.commit();
  console.log(`${collectionName} collection populated successfully`);
}

async function main() {
  await populateCollection("ingredients", ingredientsData);
  await populateCollection("diets", dietsData);
}

main().catch(console.error);