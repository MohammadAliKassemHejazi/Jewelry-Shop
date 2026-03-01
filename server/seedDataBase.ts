import db from './src/models/index';
import bcrypt from 'bcrypt';

async function seedDatabase() {
  try {
    // Delete all existing data (truncate tables) if needed
    await db.CartItem.destroy({ where: {} });
    await db.Cart.destroy({ where: {} });
    await db.OrderItem.destroy({ where: {} });
    await db.Order.destroy({ where: {} });
    await db.ProductImage.destroy({ where: {} });
    await db.SizeItem.destroy({ where: {} });
    await db.Favorite.destroy({ where: {} });
    await db.Product.destroy({ where: {} });
    await db.SubCategory.destroy({ where: {} });
    await db.Category.destroy({ where: {} });
    await db.Size.destroy({ where: {} });
    await db.User.destroy({ where: {} });

    console.log('Existing data cleared.');

    // 1. Create Admin User
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync('1234554321', salt);

    const adminUser = await db.User.create({
      name: 'Admin',
      surname: 'User',
      email: 'admin@admin.com',
      password: hashedPassword,
      phone: '1234567890',
      role: 'admin',
      isAdmin: true,
      avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=random'
    });

    const vendorUser = await db.User.create({
      name: 'Vendor',
      surname: 'Shop',
      email: 'vendor@shop.com',
      password: hashedPassword,
      phone: '0987654321',
      role: 'vendor',
      isAdmin: false,
      avatar: 'https://ui-avatars.com/api/?name=Vendor+Shop&background=random'
    });

    const regularUser = await db.User.create({
      name: 'John',
      surname: 'Doe',
      email: 'user@user.com',
      password: hashedPassword,
      phone: '1122334455',
      role: 'user',
      isAdmin: false,
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random'
    });

    console.log('Users created including admin@admin.com.');

    // 2. Create Categories
    const categories = await db.Category.bulkCreate([
      { name: 'Rings', description: 'Beautiful rings for every occasion', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500' },
      { name: 'Earrings', description: 'Elegant earrings to complement your style', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500' },
      { name: 'Necklaces', description: 'Stunning necklaces for any outfit', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500' },
      { name: 'Bracelets', description: 'Charming bracelets to complete your look', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500' }
    ]);

    console.log('Categories created.');

    // 3. Create Subcategories
    const subCategories = await db.SubCategory.bulkCreate([
      { name: 'Engagement Rings', categoryId: categories[0].id },
      { name: 'Wedding Rings', categoryId: categories[0].id },
      { name: 'Fashion Rings', categoryId: categories[0].id },
      { name: 'Stud Earrings', categoryId: categories[1].id },
      { name: 'Hoop Earrings', categoryId: categories[1].id },
      { name: 'Drop Earrings', categoryId: categories[1].id },
      { name: 'Pendant Necklaces', categoryId: categories[2].id },
      { name: 'Chains', categoryId: categories[2].id },
      { name: 'Charm Bracelets', categoryId: categories[3].id },
      { name: 'Bangles', categoryId: categories[3].id }
    ]);

    console.log('Subcategories created.');

    // 4. Create Sizes
    const sizes = await db.Size.bulkCreate([
      { size: '5' }, { size: '6' }, { size: '7' }, { size: '8' }, { size: '9' },
      { size: 'S' }, { size: 'M' }, { size: 'L' }, { size: '16"' }, { size: '18"' }, { size: '20"' }
    ]);

    console.log('Sizes created.');

    // 5. Create Products
    const productsData = [
      {
        name: 'Diamond Solitaire Engagement Ring',
        description: 'A classic 1-carat diamond solitaire engagement ring in 18k white gold.',
        price: 2500,
        stock: 10,
        image: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=500',
        images: ['https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=500', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500'],
        sku: 'RING-DIA-001',
        featured: true,
        isActive: true,
        ownerId: adminUser.id,
        categoryId: categories[0].id,
        subcategoryId: subCategories[0].id,
        rating: 4.9,
        reviewCount: 24,
        materials: ['18k White Gold', 'Diamond'],
        gemstones: ['Diamond']
      },
      {
        name: 'Sapphire and Diamond Halo Ring',
        description: 'Stunning blue sapphire surrounded by a halo of brilliant diamonds.',
        price: 1800,
        stock: 5,
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500',
        sku: 'RING-SAP-002',
        featured: true,
        isActive: true,
        ownerId: adminUser.id,
        categoryId: categories[0].id,
        subcategoryId: subCategories[0].id,
        rating: 4.8,
        reviewCount: 15,
        materials: ['Platinum', 'Sapphire', 'Diamond']
      },
      {
        name: 'Classic Gold Wedding Band',
        description: 'Simple and elegant 14k yellow gold wedding band, 4mm width.',
        price: 350,
        stock: 20,
        image: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=500',
        sku: 'RING-WED-001',
        isActive: true,
        ownerId: vendorUser.id,
        categoryId: categories[0].id,
        subcategoryId: subCategories[1].id,
        materials: ['14k Yellow Gold']
      },
      {
        name: 'Pearl Stud Earrings',
        description: 'Classic Akoya cultured pearl stud earrings in 14k white gold.',
        price: 250,
        stock: 30,
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500',
        sku: 'EAR-PRL-001',
        featured: true,
        isActive: true,
        ownerId: adminUser.id,
        categoryId: categories[1].id,
        subcategoryId: subCategories[3].id,
        rating: 4.7,
        reviewCount: 42,
        materials: ['14k White Gold', 'Pearl']
      },
      {
        name: 'Diamond Hoop Earrings',
        description: 'Elegant inside-out diamond hoop earrings in 18k white gold.',
        price: 1200,
        stock: 12,
        image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=500',
        sku: 'EAR-DIA-002',
        onSale: true,
        salePrice: 999,
        isActive: true,
        ownerId: vendorUser.id,
        categoryId: categories[1].id,
        subcategoryId: subCategories[4].id,
        materials: ['18k White Gold', 'Diamond']
      },
      {
        name: 'Emerald Tear Drop Earrings',
        description: 'Exquisite emerald teardrops with diamond accents.',
        price: 850,
        stock: 8,
        image: 'https://images.unsplash.com/photo-1599643478514-4a11018c614b?w=500',
        sku: 'EAR-EMR-003',
        isActive: true,
        ownerId: adminUser.id,
        categoryId: categories[1].id,
        subcategoryId: subCategories[5].id,
        materials: ['14k Yellow Gold', 'Emerald', 'Diamond']
      },
      {
        name: 'Heart Pendant Necklace',
        description: 'Delicate open heart pendant necklace in sterling silver with diamond accent.',
        price: 120,
        stock: 50,
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500',
        sku: 'NEC-HRT-001',
        featured: true,
        isActive: true,
        ownerId: vendorUser.id,
        categoryId: categories[2].id,
        subcategoryId: subCategories[6].id,
        rating: 4.5,
        reviewCount: 112,
        materials: ['Sterling Silver', 'Diamond']
      },
      {
        name: '18k Gold Paperclip Chain',
        description: 'Trendy 18k yellow gold paperclip link chain necklace, 18 inches.',
        price: 450,
        stock: 15,
        image: 'https://images.unsplash.com/photo-1599643477874-ce26c6d26732?w=500',
        sku: 'NEC-CHN-002',
        isActive: true,
        ownerId: adminUser.id,
        categoryId: categories[2].id,
        subcategoryId: subCategories[7].id,
        materials: ['18k Yellow Gold']
      },
      {
        name: 'Rose Gold Charm Bracelet',
        description: '14k rose gold charm bracelet, ready for your personalized charms.',
        price: 320,
        stock: 25,
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500',
        sku: 'BRA-CHM-001',
        isActive: true,
        ownerId: adminUser.id,
        categoryId: categories[3].id,
        subcategoryId: subCategories[8].id,
        materials: ['14k Rose Gold']
      },
      {
        name: 'Diamond Tennis Bracelet',
        description: 'Classic 3-carat diamond tennis bracelet in 14k white gold.',
        price: 2800,
        stock: 5,
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500',
        sku: 'BRA-DIA-002',
        featured: true,
        onSale: true,
        salePrice: 2400,
        isActive: true,
        ownerId: vendorUser.id,
        categoryId: categories[3].id,
        materials: ['14k White Gold', 'Diamond']
      }
    ];

    const createdProducts = await db.Product.bulkCreate(productsData);

    console.log('Products created.');

    // 6. Connect Sizes to Products
    // Ring sizes
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 5; j++) {
        await db.SizeItem.create({
          productId: createdProducts[i].id,
          sizeId: sizes[j].id,
          quantity: 5
        });
      }
    }

    // Bracelet sizes
    for (let i = 8; i < 10; i++) {
      for (let j = 5; j < 8; j++) {
        await db.SizeItem.create({
          productId: createdProducts[i].id,
          sizeId: sizes[j].id,
          quantity: 3
        });
      }
    }

    // Necklace lengths
    for (let i = 6; i < 8; i++) {
      for (let j = 8; j < 11; j++) {
        await db.SizeItem.create({
          productId: createdProducts[i].id,
          sizeId: sizes[j].id,
          quantity: 10
        });
      }
    }

    console.log('Sizes linked to products.');

    // 7. Create Some Cart Items for the regular user
    const cart = await db.Cart.create({
      userId: regularUser.id,
      total: createdProducts[0].price + createdProducts[3].price,
      itemCount: 2
    });

    await db.CartItem.bulkCreate([
      {
        cartId: cart.id,
        productId: createdProducts[0].id,
        quantity: 1
      },
      {
        cartId: cart.id,
        productId: createdProducts[3].id,
        quantity: 1
      }
    ]);

    console.log('Sample cart created.');

    // 8. Create Sample Order
    const order = await db.Order.create({
      userId: regularUser.id,
      customerName: regularUser.name + ' ' + regularUser.surname,
      customerEmail: regularUser.email,
      total: createdProducts[6].price * 2,
      status: 'completed',
      shippingAddress: {
        street: '123 Main St',
        city: 'Metropolis',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      },
      paymentMethod: 'Credit Card',
      paymentStatus: 'paid'
    });

    await db.OrderItem.bulkCreate([
      {
        orderId: order.id,
        productId: createdProducts[6].id,
        name: createdProducts[6].name,
        quantity: 2,
        price: createdProducts[6].price,
        image: createdProducts[6].image
      }
    ]);

    console.log('Sample order created.');

    console.log('Database has been successfully seeded with a full set of data.');
  } catch (error) {
    console.error('Failed to seed database:', error);
  }
}

export default seedDatabase;
