const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const fs = require('fs');
const yaml = require('js-yaml');
require('dotenv').config();
const port = process.env.PORT;

// Swagger setup
// const swaggerOptions = {
//     swaggerDefinition: {
//       openapi: '3.0.3',
//       myapi: '3.0.0',
//       info: {
//         title: 'CPR API Documentation',
//         version: '1.2.0',
//         description: 'API documentation',
//       },
//       servers: [
//         {
//           url: `http://localhost:${port}`,
//         },
//       ],
//       tags: [
//         {
//           name: 'User',
//           description: 'API related to User',
//         },
//         {
//           name: 'Item',
//           description: 'API related to Item',
//         },
//         {
//           name: 'Order',
//           description: 'API related to Order',
//         }
//       ],
//       definitions:{
//           Item: {
//             type: 'object',
//             properties: {
//               item_name: {
//                 type: 'string',
//                 example: 'Name of item',
//               },
//               category: {
//                 type: 'array',
//                 items: {
//                   type: 'string',
//                 },
//                 example: ['category 1', 'category 2'],
//               },
//               item_url: {
//                 type: 'string',
//                 format: 'uri',
//                 example: 'URL of item image',
//               },
//               description: {
//                 type: 'string',
//                 example: 'Description of item',
//               },
//               price: {
//                 type: 'number',
//                 example: 0,
//               },
//               status: {
//                 type: 'string',
//                 example: 'Active',
//                 enum: ['Active', 'Inactive'],
//               }
//             },
//             required: ['item_name', 'category', 'item_url', 'description', 'price'],
//           },
//       }
//     },
//     apis: ['./routes/*.js'], // files containing annotations as above
//   };
  
  const swaggerDocs = yaml.load(fs.readFileSync('./src/swagger/swagger.yaml', 'utf8'));
  

  module.exports = (app) => {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  }