/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('products', {
    Id: {
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    category_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    brand_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    material: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    image1: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    image2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    image3: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    image4: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    image5: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'products'
  });
};
