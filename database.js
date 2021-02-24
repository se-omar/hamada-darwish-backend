const Seq = require("sequelize").Sequelize;
const sequelize = new Seq("hamada-ecommerce", "root", "", {
  host: "localhost",
  dialect: "mysql",
  define: {
    timestamps: false,
    underscored: true,
  },
});
const db = {
  sequelize: sequelize,
  users: sequelize.import("./models/users"),
  products: sequelize.import("./models/products"),
  brands: sequelize.import("./models/brands"),
  categories: sequelize.import("./models/categories"),
  sizes: sequelize.import("./models/sizes"),
  products_brands: sequelize.import("./models/products_brands"),
  products_categories: sequelize.import("./models/products_categories"),
  products_colors: sequelize.import("./models/products_colors"),
  products_sizes: sequelize.import("./models/products_sizes"),
  
}

db.categories.hasMany(db.products, {
    foreignKey: "category_id"
})
db.products.belongsTo(db.categories)

db.brands.hasMany(db.products, {
    foreignKey: "brand_id"
})
db.products.belongsTo(db.brands)

module.exports = db;