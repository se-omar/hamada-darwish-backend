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
  products_brands: sequelize.import("./models/products_brands"),
  products_categories: sequelize.import("./models/products_categories"),
}

module.exports = db;