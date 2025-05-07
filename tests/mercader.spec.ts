import { describe, test, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/posada.js";
import { Mercader } from "../src/models/mercader.js";

// Borrar la base de datos antes de cada prueba
beforeEach(async () => {
  await Mercader.deleteMany();
});

describe("POST /mercaderes", () => {
  test("Debería crea un nuevo usuario correctamente.", async () => {
    await request(app)
      .post("/mercaderes")
      .send({
        id: 1,
        nombre: "Eduardo Segredo",
        tipo: "Mercader general",
        ubicacion: "Novigrado"
      })
      .expect(201);
  });
});

describe("GET /mercaderes", () => {
  test("No debería obtener, puesto que no hay mercaderes.", async () => {
    await request(app)
      .get("/mercaderes")
      .expect(404);
  });
});

describe("GET /mercaderes", () => {
  test("No debería obtener, puesto que no hay mercaderes.", async () => {
    await request(app)
      .get("/mercaderes?nombre=Eduardo Segredo")
      .expect(404);
  });
});
