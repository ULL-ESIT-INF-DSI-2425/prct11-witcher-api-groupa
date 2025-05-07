import { describe, test } from "vitest";
import request from "supertest";
import { app } from "../src/posada.js";

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
