/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('products_brands', {
    Id: {
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    product_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    brand_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'products_brands'
  });
};
