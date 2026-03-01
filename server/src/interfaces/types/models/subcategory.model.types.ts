export interface ISubCategoryAttributes {
    id?: string; // Unique identifier for the subcategory
    categoryId?: string; // Foreign key
    name: string; // Name of the subcategory
}
