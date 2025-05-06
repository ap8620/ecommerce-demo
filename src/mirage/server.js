/* eslint-disable no-console */

import { createServer, Factory, Model, Response, RestSerializer } from "miragejs";
import { faker } from '@faker-js/faker';

export function makeServer({ environment = "test" } = {}) {
  let server = createServer({
    environment,
    
    models: {
      product: Model.extend(),
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
      server.createList('product', 20);
    },

    serializers: {
      application: RestSerializer,
    },

    routes() {
      this.urlPrefix = "https://localhost:5001";

      this.get("/products", (schema) => {
      return schema.products.all().models;
      });
    },
  })

  return server;
}