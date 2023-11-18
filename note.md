command init models
npx sequelize-cli model:generate --name User --attributes fullname:string,username:string,email:string,password:string,role:enum,phone:string,address:string
npx sequelize-cli model:generate --name Order --attributes userId:bigint,productOrderId:bigint
npx sequelize-cli model:generate --name ProductOrder --attributes productId:bigint,note:string,qty:bigint
npx sequelize-cli model:generate --name Product --attributes productName:string,categoryId:bigint,image:string,description:string,createdBy:bigint,updatedBy:bigint
npx sequelize-cli model:generate --name Categories --attributes categoryName:string,note:string,createdBy:bigint,updatedBy:bigint
