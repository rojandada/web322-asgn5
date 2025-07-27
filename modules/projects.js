/********************************************************************************
*  WEB322 – Assignment 05
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Rojan KC      Student ID: 171714231      Date: 2025-07-27
*
********************************************************************************/

require('dotenv').config();
require('pg');
const Sequelize = require('sequelize');

let sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

const Sector = sequelize.define('Sector', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  sector_name: Sequelize.STRING,
}, { timestamps: false });

const Project = sequelize.define('Project', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: Sequelize.STRING,
  feature_img_url: Sequelize.STRING,
  summary_short: Sequelize.TEXT,
  intro_short: Sequelize.TEXT,
  impact: Sequelize.TEXT,
  original_source_url: Sequelize.STRING,
  sector_id: Sequelize.INTEGER,
}, { timestamps: false });

Project.belongsTo(Sector, { foreignKey: 'sector_id' });

module.exports = {
  initialize: function () {
    return sequelize.sync();
  },

  getAllProjects: function () {
    return Project.findAll({ include: [Sector] });
  },

  getProjectById: function (id) {
    return Project.findAll({
      include: [Sector],
      where: { id: id }
    }).then(data => {
      if (data.length > 0) return data[0];
      else throw new Error("Unable to find requested project");
    });
  },

  getProjectsBySector: function (sector) {
    return Project.findAll({
      include: [Sector],
      where: {
        "$Sector.sector_name$": {
          [Sequelize.Op.iLike]: `%${sector}%`
        }
      }
    }).then(data => {
      if (data.length > 0) return data;
      else throw new Error("Unable to find requested projects");
    });
  },

  getAllSectors: function () {
    return Sector.findAll();
  },

  addProject: function (projectData) {
    return Project.create(projectData).catch(err => {
      throw new Error(err.errors[0].message);
    });
  },

  editProject: function (id, projectData) {
    return Project.update(projectData, {
      where: { id: id }
    }).catch(err => {
      throw new Error(err.errors[0].message);
    });
  },

  deleteProject: function (id) {
    return Project.destroy({
      where: { id: id }
    }).catch(err => {
      throw new Error(err.errors[0].message);
    });
  }
};
