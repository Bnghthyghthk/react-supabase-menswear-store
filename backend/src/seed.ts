import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import Product from './models/Product';
import bcrypt from 'bcryptjs';

dotenv.config();

const sampleProducts = [
  {
    name: 'Classic White Oxford Shirt',
    description: 'A timeless white Oxford shirt perfect for any occasion. Made from premium cotton with a comfortable fit.',
    price: 59.99,
    category: 'shirts',
    brand: 'Premium Style',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Light Blue'],
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
      'https://images.unsplash.com/photo-1621072294634-3c04285ed1f3?w=800'
    ],
    stock: 50,
    featured: true,
    rating: 4.5,
    numReviews: 12
  },
  {
    name: 'Navy Blue Suit',
    description: 'Elegant navy blue business suit with modern tailoring. Perfect for formal events and business meetings.',
    price: 299.99,
    category: 'suits',
    brand: 'Executive Wear',
    sizes: ['38', '40', '42', '44', '46'],
    colors: ['Navy Blue'],
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
      'https://images.unsplash.com/photo-1594970606935-45bd602e5a50?w=800'
    ],
    stock: 20,
    featured: true,
    rating: 4.8,
    numReviews: 8
  },
  {
    name: 'Black Leather Shoes',
    description: 'Premium black leather dress shoes with classic design. Comfortable for all-day wear.',
    price: 129.99,
    category: 'shoes',
    brand: 'Italian Leather',
    sizes: ['41', '42', '43', '44', '45'],
    colors: ['Black'],
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800'
    ],
    stock: 30,
    featured: true,
    rating: 4.6,
    numReviews: 15
  },
  {
    name: 'Denim Jeans',
    description: 'Classic fit denim jeans with comfortable stretch. Perfect for casual wear.',
    price: 79.99,
    category: 'pants',
    brand: 'Urban Style',
    sizes: ['30', '32', '34', '36', '38'],
    colors: ['Blue', 'Black'],
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93ec?w=800'
    ],
    stock: 60,
    featured: false,
    rating: 4.3,
    numReviews: 25
  },
  {
    name: 'Leather Belt',
    description: 'Genuine leather belt with classic buckle. Essential accessory for any outfit.',
    price: 39.99,
    category: 'accessories',
    brand: 'Premium Accessories',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Brown'],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
      'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800'
    ],
    stock: 40,
    featured: false,
    rating: 4.4,
    numReviews: 10
  },
  {
    name: 'Sports Jacket',
    description: 'Modern sports jacket perfect for layering. Made with premium materials for comfort.',
    price: 149.99,
    category: 'jackets',
    brand: 'Urban Sports',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Navy', 'Gray', 'Black'],
    images: [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800',
      'https://images.unsplash.com/photo-1591047139829-d91ecb6e0f20?w=800'
    ],
    stock: 25,
    featured: true,
    rating: 4.7,
    numReviews: 6
  },
  {
    name: 'Cotton T-Shirt Pack',
    description: 'Pack of 3 premium cotton t-shirts. Essential basics for everyday wear.',
    price: 49.99,
    category: 'shirts',
    brand: 'Basic Essentials',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Black', 'Gray'],
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800'
    ],
    stock: 80,
    featured: false,
    rating: 4.2,
    numReviews: 18
  },
  {
    name: 'Wool Sweater',
    description: 'Cozy merino wool sweater perfect for cold weather. Soft and comfortable.',
    price: 89.99,
    category: 'shirts',
    brand: 'Winter Comfort',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Navy', 'Gray', 'Burgundy'],
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800'
    ],
    stock: 35,
    featured: false,
    rating: 4.6,
    numReviews: 9
  }
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    await Product.deleteMany();
    await User.deleteMany();

    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@menswear.com',
      password: 'admin123',
      role: 'admin'
    });

    await adminUser.save();

    await Product.insertMany(sampleProducts);

    console.log('✅ Data imported successfully!');
    console.log(`👤 Admin user created: admin@menswear.com / admin123`);
    console.log(`📦 ${sampleProducts.length} products created`);

    process.exit();
  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    await Product.deleteMany();
    await User.deleteMany();

    console.log('✅ Data destroyed successfully!');

    process.exit();
  } catch (error) {
    console.error('❌ Error destroying data:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}