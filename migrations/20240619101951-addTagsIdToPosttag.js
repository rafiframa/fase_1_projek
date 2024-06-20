'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('PostTags', 'TagId', { type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'Tags',
        },
        key: 'id',
      },
     });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
