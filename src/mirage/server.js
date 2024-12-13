/* eslint-disable no-console */
// src/server.js
import { createServer, Model, Response, RestSerializer } from "miragejs";
import products from "./seedData/candy_products.json";
// import { uniq } from "ramda";
// import tags from "./seedData/tags.json";


console.log('seedData');

export function makeServer({ environment = "test" } = {}) {
  let server = createServer({
    environment,

    models: {
      product: Model.extend(),
    },

    seeds(server) {
      const sandboxData = localStorage.getItem('sandboxData');
      console.log('anish sandBox data', sandboxData);
      if (!sandboxData) {
        console.log('anish creating sandboxData');
        // only seed when there is nothing in localStorage
        // server.create("article", articles.articles[0]);
        // server.create("article", articles.articles[1]);
        // server.create("article", articles.articles[2]);
        //
        const seedData = {
          products: products,
          //tags: tags.tags
        };

        server.db.loadData(seedData);

        // server.create("tag", tags.tags[0]);
        // server.create("tag", tags.tags[1]);
        // const localStorageDB = {
        //   articles: server.db.articles
        // };
        // localStorage.setItem('sandboxData', JSON.stringify(seedData));
      } else {
        server.db.loadData(JSON.parse(sandboxData));
      }
    },

    serializers: {
      application: RestSerializer,
    },

    routes() {
    //   this.namespace = "api";
      this.urlPrefix = "https://fakestoreapi.com";

      this.get("/products", (schema) => {
      console.log('first product', schema.products.first());
      return schema.products.all().models;
      });

    //   this.get("/tags", (schema) => {
    //     // HAD TO DO LOGIC HERE
    //     let allTags = [];
    //     schema.articles.all().models.forEach(x => {
    //       allTags = uniq([...allTags, ...x.tagList]);
    //     });
    //     console.log('anish get tags', allTags);
    //     return {
    //       tags: allTags
    //     }
    //   });
    },
  })

  console.log('mirage db', server.db);

  return server;
}