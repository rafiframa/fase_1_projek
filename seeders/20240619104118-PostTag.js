'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let postTag = require(`../data/posttags.json`)
    .map(e=>{
      e.createdAt = e.updatedAt = new Date()
      return e
    })

    await queryInterface.bulkInsert('PostTags', postTag, {});
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
