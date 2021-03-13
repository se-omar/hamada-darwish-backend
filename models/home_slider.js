/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('home_slider', {
    Id: {
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    text_a1: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    text_a2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    text_a3: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    text_b1: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    text_b2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    text_b3: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    text_c1: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    text_c2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    text_c3: {
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
    }
  }, {
    sequelize,
    tableName: 'home_slider'
  });
};
