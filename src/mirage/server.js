/* eslint-disable no-console */
import { createServer, Model, Response, RestSerializer } from "miragejs";
import products from "./seedData/candy_products.json";

export function makeServer({ environment = "test" } = {}) {
  let server = createServer({
    environment,

    models: {
      product: Model.extend(),
    },

    seeds(server) {
      const sandboxData = localStorage.getItem('sandboxData');
      if (!sandboxData) {
        // If no sandbox data in localStorage, load the initial seed data
        const seedData = {
          products: products,
        };

        server.db.loadData(seedData);
        localStorage.setItem('sandboxData', JSON.stringify(seedData));
      } else {
        server.db.loadData(JSON.parse(sandboxData));
      }
    },

    serializers: {
      application: RestSerializer,
    },

    routes() {
      this.urlPrefix = "https://localhost:5001";

      this.get("/products", (schema) => {
      return schema.products.all().models;
      });

      this.post("/products", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const product = schema.products.create(attrs);
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
        localStorage.setItem('sandboxData', JSON.stringify({products: server.db.products}));
        return new Response(204);
      });
    },
  })

  return server;
}