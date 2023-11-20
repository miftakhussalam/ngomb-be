'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Categories', [
      {
        categoryName: 'Minuman',
        note: '',
        createdBy: 'admin',
        updatedBy: 'admin',
        createdAt: '2023-11-20T05:36:04.212Z',
        updatedAt: '2023-11-20T05:36:04.212Z'
      },
      {
        categoryName: 'Makanan',
        note: '',
        createdBy: 'admin',
        updatedBy: 'admin',
        createdAt: '2023-11-20T05:36:04.212Z',
        updatedAt: '2023-11-20T05:36:04.212Z'
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
