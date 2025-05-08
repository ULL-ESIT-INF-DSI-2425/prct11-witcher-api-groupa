import { describe, test, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/posada.js";
import { Cazador } from "../src/models/cazador.js";

// Borrar la base de datos antes de cada prueba
beforeEach(async () => {
  await Cazador.deleteMany();
});

//// TESTS DE POST ////
describe("POST /cazadores, 201", () => {
  test("Debería crea un nuevo usuario correctamente.", async () => {
    await request(app)
      .post("/cazadores")
      .send({
        id: 1,
        nombre: "Fran",
        raza: "Humano",
        ubicacion: "Novigrado"
      })
      .expect(201);
  });
});

describe("POST /cazadores, 401", () => {
  test("Debería fallar en crea un nuevo usuario correctamente.", async () => {
    await request(app)
      .post("/cazadores")
      .send({
        id: 1,
        nombre: "Fran",
        raza: "Humano",
        ubicacion: "Novigrado"
      })
      .expect(401);
  });
});

//// TESTS DE GET ////
describe("GET /cazadores, 404", () => {
  test("No debería obtener, puesto que no hay cazadores.", async () => {
    await request(app)
      .get("/cazadores")
      .expect(404);
  });
}),

describe("GET /cazadores, 200", () => {
  test("Debería obtener correctamente cazadores.", async () => {
    await request(app)
      .post("/cazadores")
      .send({
        id: 1,
        nombre: "Daniel",
        raza: "Humano",
        ubicacion: "Novigrado"
      })
      .expect(201);
    await request(app)
      .get("/cazadores")
      .expect(200);
  });
});

describe("GET /cazadores?query, 404", () => {
  test("No debería obtener, puesto que no hay cazadores.", async () => {
    await request(app)
      .get("/cazadores?nombre=Fran")
      .expect(404);
  });
});

describe("GET /cazadores?query, 200", () => {
  test("Debería obtener correctamente cazadores.", async () => {
    await request(app)
      .post("/cazadores")
      .send({
        id: 1,
        nombre: "Daniel",
        raza: "Humano",
        ubicacion: "Novigrado"
      })
      .expect(201);
    await request(app)
      .get("/cazadores?nombre=Daniel")
      .expect(200);
  });
});

describe("GET /cazadores/:id, 404", () => {
  test("No debería obtener, puesto que no hay cazadores.", async () => {
    await request(app)
      .get("/cazadores/1")
      .expect(404);
  });
});

describe("GET /cazadores/:id, 200", () => {
  test("Debería obtener correctamente cazadores.", async () => {
    await request(app)
      .post("/cazadores")
      .send({
        id: 1,
        nombre: "Daniel",
        raza: "Humano",
        ubicacion: "Novigrado"
      })
      .expect(201);
    await request(app)
      .get("/cazadores/1")
      .expect(200);
  });
});

//// TESTS DE DELETE ////
describe("DELETE /cazadores/:id, 404", () => {
  test("No debería eliminar, puesto que no hay cazadores.", async () => {
    await request(app)
      .delete("/cazadores/1")
      .expect(404);
  });
});

describe("DELETE /cazadores/:id, 200", () => {
  test("Debería eliminar correctamente cazadores.", async () => {
    await request(app)
      .post("/cazadores")
      .send({
        id: 1,
        nombre: "Daniel",
        raza: "Humano",
        ubicacion: "Novigrado"
      })
      .expect(201);
    await request(app)
      .delete("/cazadores/1")
      .expect(200);
  });
});

