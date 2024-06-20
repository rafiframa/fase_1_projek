'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let profile = require(`../data/profiles.json`)
    .map(e=>{
      e.createdAt = e.updatedAt = new Date()
      return e
    })

    await queryInterface.bulkInsert('Profiles', profile, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
