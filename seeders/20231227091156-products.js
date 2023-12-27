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
    await queryInterface.bulkInsert('Products', [
      {
        productName: 'Boba Small',
        categoryId: 1,
        image: "",
        description: "Minuman rasa ukuran kecil dengan toping boba",
        price: 7000,
        stock: 100,
        createdBy: 'admin',
        updatedBy: 'admin',
        createdAt: '2023-11-20T05:36:04.212Z',
        updatedAt: '2023-11-20T05:36:04.212Z'
      },
      {
        productName: 'Boba Medium',
        categoryId: 1,
        image: "",
        description: "Minuman rasa ukuran sedang dengan toping boba",
        price: 9000,
        stock: 100,
        createdBy: 'admin',
        updatedBy: 'admin',
        createdAt: '2023-11-20T05:36:04.212Z',
        updatedAt: '2023-11-20T05:36:04.212Z'
      },
      {
        productName: 'Boba Large',
        categoryId: 1,
        image: "",
        description: "Minuman rasa ukuran besar dengan toping boba",
        price: 12000,
        stock: 100,
        createdBy: 'admin',
        updatedBy: 'admin',
        createdAt: '2023-11-20T05:36:04.212Z',
        updatedAt: '2023-11-20T05:36:04.212Z'
      },
      {
        productName: 'Pisang Crispy',
        categoryId: 2,
        image: "",
        description: "Makanan ringan dengan bahan dasar pisang",
        price: 2000,
        stock: 100,
        createdBy: 'admin',
        updatedBy: 'admin',
        createdAt: '2023-11-20T05:36:04.212Z',
        updatedAt: '2023-11-20T05:36:04.212Z'
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
