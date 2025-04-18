/* eslint-disable no-console */

import { createServer, Factory, Model, Response, RestSerializer } from "miragejs";
import { faker } from '@faker-js/faker';
import products from "./seedData/candy_products.json";

console.log('serverBasic seedData');

export function makeServer({ environment = "test" } = {}) {
  let server = createServer({
    environment,
    
    models: {
      product: Model.extend(),
    },

    fixtures: {
      products: products
    },

    factories: {
      product: Factory.extend({ 
        id(i) {
          return i + 1;
        },
        title() {
          return faker.commerce.productName();
        },
        price() {
          return faker.commerce.price();
        },
        description() {
          return faker.commerce.productDescription();
        },
        category() {
          return faker.commerce.department();
        },
        image() {
          return faker.image.url();
        },
      }),
    },


    seeds(server) {
      // server.loadFixtures();
      server.createList('product', 20);
    },

    serializers: {
      application: RestSerializer,
    },

    routes() {
    //   this.namespace = "api";
      this.urlPrefix = "https://localhost:5001";

      this.get("/products", (schema) => {
      console.log('first product', schema.products.first());
      return schema.products.all().models;
      });

      this.post("/products", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const product = schema.products.create(attrs);
        console.log('anish mirage product 64', product);
        console.log('anish mirage schema products', schema.products.all().models);
        console.log('anish mirage db products', server.db.products);
        localStorage.setItem('sandboxData', JSON.stringify({products: server.db.products}));
        // GOTCHA: return .attrs to return only the attributes and not have product as a key in the response
        return product.attrs;
      });

      this.put("/products/:id", (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);

        // find the existing product by id
        let product = schema.products.find(id);

        if (!product) {
          return new Response(404, {}, { errors: ["Product not found"] });
        }

        // Update the product with new attributes
        product.update(attrs);

        console.log('anish mirage updated product', product);
        localStorage.setItem('sandboxData', JSON.stringify({products: server.db.products}));
        // GOTCHA: return .attrs to return only the attributes and not have product as a key in the response
        return product.attrs;
      });

      this.delete("/products/:id", (schema, request) => {
        const id = request.params.id;

        // find the existing product by id
        let product = schema.products.find(id);

        if (!product) {
          return new Response(404, {}, { errors: ["Product not found"] });
        }

        // Destroy the product
        product.destroy();

        console.log('anish mirage deleted product', id);
        localStorage.setItem('sandboxData', JSON.stringify({products: server.db.products}));
        return new Response(204);
      });
    },
  })

  console.log('mirage db', server.db);

  return server;
}