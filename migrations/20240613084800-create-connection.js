'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Connections', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      projectId: {
        type: Sequelize.STRING
      },
      organizationId: {
        type: Sequelize.STRING
      },
      host: {
        type: Sequelize.STRING
      },
      userName: {
        type: Sequelize.STRING
      },
      port: {
        type: Sequelize.STRING
      },
      dialect: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      database: {
        type: Sequelize.STRING
      },
      url: {
        type: Sequelize.STRING
      },
      rootUser: {
        type: Sequelize.STRING
      },
      rootPassword: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Connections');
  }
};