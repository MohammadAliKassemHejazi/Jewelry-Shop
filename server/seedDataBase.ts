import db from './src/models/index';

async function seedDatabase() {
  try {
    // Delete all existing data (truncate tables) if needed, but in production we might not want to do this.
    // For now, keeping the logic as is for dev reset.
    // Ensure new tables are cleared too if they exist.
    await db.Category.destroy({ where: {}, truncate: { cascade: true } });
    await db.SubCategory.destroy({ where: {}, truncate: { cascade: true } });
    await db.Size.destroy({ where: {}, truncate: { cascade: true } });
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

    console.log('Database has been successfully seeded.');
  } catch (error) {
    console.error('Failed to seed database:', error);
  }
}

export default seedDatabase;
