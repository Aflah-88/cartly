// index.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const cors = require('cors');
 //replace the link with your mongodb atlas link
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

app.use(express.json());
app.use(cors()); // Use the cors middleware
 
const reviewSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
}, {
    timestamps: true,
});
 
const productSchema = new mongoose.Schema({
  name: String,
  type: String,
  description: String,
  price: Number,
  image: String,
  reviews: [reviewSchema],
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  numReviews: {
    type: Number,
    required: true,
    default: 0,
  },
});
 
const Product = mongoose.model('Product', productSchema);

// Function to seed initial data into the database
const seedDatabase = async () => {
  try {
    await Product.deleteMany(); // Clear existing data
 
    const products = [
      {
        name: "Men's Casual T-shirt",
        type: 'Men',
        description: 'Comfortable and stylish casual T-shirt for men',
        price: 350,
        image: 
'https://media.geeksforgeeks.org/wp-content/uploads/20230407153931/gfg-tshirts.jpg'
      },
      {
        name: 'Luxury bag',
        type: 'Not Applicable', 
        description: 'Elegant luxury bag with leather strap',
        price: 2500,
        image: 
'https://media.geeksforgeeks.org/wp-content/uploads/20230407154213/gfg-bag.jpg'
      },
      {
        name: "Hoodie",
        type: 'Men',
        description: 'Light and classy hoodies for every seasons ',
        price: 450,
        image: 
'https://media.geeksforgeeks.org/wp-content/uploads/20230407153938/gfg-hoodie.jpg'
      },
      {
        name: 'Remote Control Toy car',
        type: 'Not Applicable', 
        description: 'High-quality Toy car for fun and adventure',
        price: 1200,
        image: 
'https://media.geeksforgeeks.org/wp-content/uploads/20240122182422/images1.jpg'
      },
      {
        name: 'Books',
        type: 'Women',
        description: 'You wll have a great time reading .',
        price: 5000,
        image: 
'https://media.geeksforgeeks.org/wp-content/uploads/20240110011854/reading-925589_640.jpg'
      },
      {
        name: 'Bag',
        type: 'Men', 
        description: 'Comfortable and supportive Bag ',
        price: 800,
        image: 
'https://media.geeksforgeeks.org/wp-content/uploads/20230407154213/gfg-bag.jpg'
      },
      {
        name: 'Winter hoodies for women',
        type: 'Women',
        description: 'Stay cozy in style with our womens hoodie, crafted for comfort ',
        price: 250,
        image: 
'https://media.geeksforgeeks.org/wp-content/uploads/20230407153938/gfg-hoodie.jpg'
      },
      
      {
        name: 'Honda car ',
        type: 'Men',
        description: 'Powerful Honda car with comfy driving',
        price: 700,
        image: 
'https://media.geeksforgeeks.org/wp-content/uploads/20240122184958/images2.jpg'
      },
      {
        name: "Men's Formal Shirt",
        type: 'Men',
        description: 'A crisp formal shirt for business meetings.',
        price: 1200,
        image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1887&auto=format&fit=crop'
      },
      {
        name: "Women's Floral Dress",
        type: 'Women',
        description: 'A beautiful floral dress perfect for summer.',
        price: 2200,
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1887&auto=format&fit=crop'
      },
      {
        name: "Men's Chino Pants",
        type: 'Men',
        description: 'Comfortable and stylish chino pants for any occasion.',
        price: 1600,
        image: 'https://media.istockphoto.com/id/508549005/photo/casual-dressed-man-hands-at-sides-isolated-on-white-background.jpg?s=1024x1024&w=is&k=20&c=i5rSZOYxqWwp8b0LgUPyrt8UjvU8TIlv3KTbQH2RgMY='
      },
      {
        name: "A-Line Skirt",
        type: 'Women',
        description: 'A classic A-line skirt for a chic look.',
        price: 900,
        image: 'https://images.unsplash.com/photo-1527332042004-0b1a4d8646a3?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      }
    ];
    
  
    
      
 
    await Product.insertMany(products);
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
 
// Seed the database on server startup
seedDatabase();
 
// Define API endpoint for fetching all products
app.get('/api/products', async (req, res) => {
  try {
    // Fetch all products from the database
    const allProducts = await Product.find();
 
    // Send the entire products array as JSON response
    res.json(allProducts);
  } catch (error) {
    console.error(error);
    res.status(500)
      .json({ error: 'Internal Server Error' });
  }
});

// Define API endpoint for fetching a single product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all reviews for a specific product
app.get('/api/products/:id/reviews', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product.reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Error fetching reviews' });
    }
});

// Get review statistics for a product
app.get('/api/products/:id/review-stats', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const stats = {
            totalReviews: product.reviews.length,
            averageRating: product.rating,
            ratingCounts: {
                5: product.reviews.filter(r => r.rating === 5).length,
                4: product.reviews.filter(r => r.rating === 4).length,
                3: product.reviews.filter(r => r.rating === 3).length,
                2: product.reviews.filter(r => r.rating === 2).length,
                1: product.reviews.filter(r => r.rating === 1).length
            }
        };

        res.json(stats);
    } catch (error) {
        console.error('Error fetching review stats:', error);
        res.status(500).json({ message: 'Error fetching review statistics' });
    }
});

// Modify the existing review posting endpoint to include more details
app.post('/api/products/:id/reviews', async (req, res) => {
    try {
        const { rating, comment, name = 'Anonymous' } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Create the review with timestamp
        const review = {
            name,
            rating: Number(rating),
            comment,
            createdAt: new Date()
        };

        // Add the review to the product
        product.reviews.push(review);

        // Update product rating and review count
        product.numReviews = product.reviews.length;
        product.rating = (
            product.reviews.reduce((acc, item) => item.rating + acc, 0) / 
            product.reviews.length
        ).toFixed(1);

        // Save the updated product
        await product.save();

        // Return the newly added review
        res.status(201).json({
            message: 'Review added successfully',
            review,
            productRating: product.rating,
            totalReviews: product.numReviews
        });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ message: 'Error adding review', error: error.message });
    }
});

// Get the latest reviews across all products
app.get('/api/latest-reviews', async (req, res) => {
    try {
        const products = await Product.find({ 'reviews.0': { $exists: true } });
        
        // Collect all reviews with product information
        let allReviews = [];
        products.forEach(product => {
            const productReviews = product.reviews.map(review => ({
                ...review.toObject(),
                productId: product._id,
                productName: product.name,
                productImage: product.image
            }));
            allReviews = [...allReviews, ...productReviews];
        });

        // Sort by date and get the latest 10 reviews
        const latestReviews = allReviews
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 10);

        res.json(latestReviews);
    } catch (error) {
        console.error('Error fetching latest reviews:', error);
        res.status(500).json({ message: 'Error fetching latest reviews' });
    }
});

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT}`
  );
});