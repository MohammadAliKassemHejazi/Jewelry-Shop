import db from './src/models/index';

async function seedDatabase() {
  try {
    // Delete all existing data (truncate tables) if needed, but in production we might not want to do this.
    // For now, keeping the logic as is for dev reset.
    // Ensure new tables are cleared too if they exist.
    await db.Category.destroy({ where: {}, truncate: { cascade: true } });
    await db.SubCategory.destroy({ where: {}, truncate: { cascade: true } });
    await db.Size.destroy({ where: {}, truncate: { cascade: true } });
    await db.Testimonial.destroy({ where: {}, truncate: { cascade: true } });
    // await db.Product.destroy({ where: {}, truncate: { cascade: true } }); // Uncomment if we want to seed products

    console.log('Existing data cleared.');

    // Create categories (Jewelry based on project context)
    const categories = await db.Category.bulkCreate([
      { name: 'Rings', description: 'Beautiful rings for every occasion', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500' },
      { name: 'Earrings', description: 'Elegant earrings to complement your style', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500' },
      { name: 'Necklaces', description: 'Stunning necklaces for any outfit', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500' },
      { name: 'Bracelets', description: 'Charming bracelets to complete your look', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500' }
    ]);

    console.log('Categories created.');

    // Create subcategories
    await db.SubCategory.bulkCreate([
      { name: 'Engagement Rings', categoryId: categories[0].id },
      { name: 'Wedding Rings', categoryId: categories[0].id },
      { name: 'Pearl Earrings', categoryId: categories[1].id },
      { name: 'Diamond Necklaces', categoryId: categories[2].id }
    ]);

    console.log('Subcategories created.');

    // Create sizes
    await db.Size.bulkCreate([
      { size: 'S' },
      { size: 'M' },
      { size: 'L' },
      { size: 'XL' }
    ]);

    console.log('Sizes created.');

    // Create Testimonials
    await db.Testimonial.bulkCreate([
      {
        name: "Sarah Johnson",
        text: "Absolutely stunning jewelry! The quality is exceptional and the designs are timeless.",
        rating: 5,
        verified: true,
        location: "New York, NY"
      },
      {
        name: "Emma Davis",
        text: "I've bought several pieces and each one is more beautiful than the last. Highly recommend!",
        rating: 5,
        verified: true,
        location: "London, UK"
      },
      {
        name: "Lisa Chen",
        text: "The customer service is outstanding and the jewelry is exactly as pictured. Love it!",
        rating: 5,
        verified: true,
        location: "San Francisco, CA"
      }
    ]);

    console.log('Testimonials created.');

    // Create Dummy Products (Optional, but helpful for initial load if product table is empty)
    // Checking if Product model exists and has data before seeding could be better, but we are truncating above (commented out).
    // Let's seed a few products if the table is empty.
    const productCount = await db.Product.count();
    if (productCount === 0) {
       await db.Product.bulkCreate([
        {
          name: 'Rose Gold Diamond Ring',
          description: 'Elegant rose gold ring with brilliant diamond',
          price: 1299,
          stock: 10,
          categoryId: categories[0].id,
          subCategoryId: null, // or fetch subcategory ID
          image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600',
          featured: true,
          isActive: true
        },
        {
          name: 'Pearl Drop Earrings',
          description: 'Classic pearl drop earrings for any occasion',
          price: 299,
          stock: 15,
          categoryId: categories[1].id,
          image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300',
          featured: true,
          isActive: true
        },
        {
           name: 'Elegant Gold Necklace',
           description: 'Timeless gold necklace with intricate design',
           price: 899,
           stock: 8,
           categoryId: categories[2].id,
           image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300',
           featured: true,
           isActive: true
        }
       ]);
       console.log('Products seeded.');
    }

    console.log('Database has been successfully seeded.');
  } catch (error) {
    console.error('Failed to seed database:', error);
  }
}

export default seedDatabase;
