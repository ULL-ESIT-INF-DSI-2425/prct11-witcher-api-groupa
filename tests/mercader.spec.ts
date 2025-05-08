import { describe, test, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { Mercader } from "../src/models/mercader.js";

// Borrar la base de datos antes de cada prueba
beforeEach(async () => {
  await Mercader.deleteMany();
});

//// TESTS DE POST ////
describe("POST /mercaderes, 201", () => {
  test("Debería crea un nuevo usuario correctamente.", async () => {
    await request(app)
      .post("/mercaderes")
      .send({
        id: 1,
        nombre: "Fran",
        tipo: "Mercader general",
        ubicacion: "Novigrado"
      })
      .expect(201);
  });
});

describe("POST /mercaderes, 401", () => {
  test("Debería fallar en crea un nuevo usuario correctamente.", async () => {
    await request(app)
      .post("/mercaderes")
      .send({
        id: 1,
        nombre: "Fran",
        tipo: "Especialista en escudos",
        ubicacion: "Novigrado"
      })
      .expect(400);
  });
});

//// TESTS DE GET ////
describe("GET /mercaderes, 404", () => {
  test("No debería obtener, puesto que no hay mercaderes.", async () => {
    await request(app)
      .get("/mercaderes")
      .expect(404);
  });
});

describe("GET /mercaderes, 200", () => {
  test("Debería obtener correctamente mercaderes.", async () => {
    await request(app)
      .post("/mercaderes")
      .send({
        id: 1,
        nombre: "Daniel",
        tipo: "Mercader general",
        ubicacion: "Novigrado"
      })
      .expect(201);
    await request(app)
      .get("/mercaderes")
      .expect(200);
  });
});

describe("GET /mercaderes?query, 404", () => {
  test("No debería obtener, puesto que no hay mercaderes.", async () => {
    await request(app)
      .get("/mercaderes?nombre=Daniel")
      .expect(404);
  });
});

describe("GET /mercaderes?query, 200", () => {
  test("Debería obtener correctamente mercaderes.", async () => {
    await request(app)
      .post("/mercaderes")
      .send({
        id: 1,
        nombre: "Daniel",
        tipo: "Mercader general",
        ubicacion: "Novigrado"
      })
      .expect(201);
      await request(app)
      .post("/mercaderes")
      .send({
        id: 2,
        nombre: "Fran",
        tipo: "Herrero",
        ubicacion: "Novigrado"
      })
      .expect(201);
    await request(app)
      .get("/mercaderes?nombre=Daniel")
      .expect(200);
  });
});

describe("GET /mercaderes/:id, 404", () => {
  test("No debería obtener, puesto que no hay mercaderes.", async () => {
    await request(app)
      .get("/mercaderes/000000000000000000000000")
      .expect(404);
  });
});

describe("GET /mercaderes/:id, 200", () => {
  test("Debería obtener correctamente mercaderes.", async () => {
    await request(app)
      .post("/mercaderes")
      .send({
        id: 1,
        nombre: "Daniel",
        tipo: "Mercader general",
        ubicacion: "Novigrado"
      })
      .expect(201);
    const mercader = await Mercader.findOne({ nombre: "Daniel" });
    const id = mercader._id;
    await request(app)
      .get(`/mercaderes/${id}`)
      .expect(200);
  });
});

//// TESTS DE DELETE ////
describe("DELETE /mercaderes/:id, 404", () => {
  test("No debería eliminar, puesto que no hay mercaderes.", async () => {
    await request(app)
      .delete("/mercaderes/000000000000000000000000")
      .expect(404);
  });
});

describe("DELETE /mercaderes/:id, 200", () => {
  test("Debería eliminar correctamente mercader.", async () => {
    await request(app)
      .post("/mercaderes")
      .send({
        id: 1,
        nombre: "Daniel",
        tipo: "Mercader general",
        ubicacion: "Novigrado"
      })
      .expect(201);
      const mercader = await Mercader.findOne({ nombre: "Daniel" });
      const id = mercader._id;
    await request(app)
      .delete(`/mercaderes/${id}`)
      .expect(200);
  });
});

describe("DELETE /mercaderes?query, 404", () => {
  test("No debería eliminar, puesto que no hay mercaderes.", async () => {
    await request(app)
      .delete("/mercaderes?nombre=Daniel")
      .expect(404);
  });
});

describe("DELETE /mercaderes?query, 403", () => {
  test("No debería eliminar, puesto que hay varios mercaderes de mismo nombre.", async () => {
    await request(app)
      .post("/mercaderes?nombre=Daniel")
      .send({
        id: 1,
        nombre: "Daniel",
        tipo: "Mercader general",
        ubicacion: "Novigrado"
      })
      .expect(201);
      await request(app)
      .post("/mercaderes?nombre=Daniel")
      .send({
        id: 2,
        nombre: "Daniel",
        tipo: "Mercader general",
        ubicacion: "Novigrado"
      })
      .expect(201);
    await request(app)
      .delete("/mercaderes?nombre=Daniel")
      .expect(403);
  });
});

describe("DELETE /mercaderes?query, 200", () => {
  test("Debería eliminar correctamente mercaderes.", async () => {
    await request(app)
      .post("/mercaderes?nombre=Daniel")
      .send({
        id: 1,
        nombre: "Daniel",
        tipo: "Mercader general",
        ubicacion: "Novigrado"
      })
      .expect(201);
    await request(app)
      .delete(`/mercaderes?nombre=Daniel`)
      .expect(200);
  });
});

//// TESTS DE PATCH ////
describe("PATCH /mercaderes/:id, 404", () => {
  test("No debería actualizar, puesto que no hay mercaderes.", async () => {
    await request(app)
      .patch("/mercaderes/000000000000000000000000")
      .send({
        nombre: "Daniel",
        tipo: "Mercader general",
        ubicacion: "Novigrado"
      })
      .expect(404);
  });
});

describe("PATCH /mercaderes/:id, 200", () => {
  test("Debería actualizar correctamente mercader.", async () => {
    await request(app)
      .post("/mercaderes")
      .send({
        id: 1,
        nombre: "Daniel",
        tipo: "Mercader general",
        ubicacion: "Novigrado"
      })
      .expect(201);
    const mercader = await Mercader.findOne({ nombre: "Daniel" });
    const id = mercader._id;
    await request(app)
      .patch(`/mercaderes/${id}`)
      .send({
        nombre: "Fran",
        tipo: "Herrero",
        ubicacion: "Skellige"
      })
      .expect(200);
  });
});

describe("PATCH /mercaderes/:id, 200", () => {
  test("Debería prohibir la actualizacion del mercader.", async () => {
    await request(app)
      .post("/mercaderes")
      .send({
        id: 1,
        nombre: "Daniel",
        tipo: "Mercader general",
        ubicacion: "Novigrado"
      })
      .expect(201);
    const mercader = await Mercader.findOne({ nombre: "Daniel" });
    const id = mercader._id;
    await request(app)
      .patch(`/mercaderes/${id}`)
      .send({
        id: 3,
        nombre: "Fran",
        tipo: "Herrero",
        ubicacion: "Skellige"
      })
      .expect(401);
  });
});

describe("PATCH /mercaderes?query, 404", () => {
  test("No debería actualizar, puesto que no hay mercaderes.", async () => {
    await request(app)
      .patch("/mercaderes?nombre=Daniel")
      .send({
        nombre: "Daniel",
        tipo: "Mercader general",
        ubicacion: "Novigrado"
      })
      .expect(404);
  });
});

describe("PATCH /mercaderes?query, 403", () => {
  test("No debería actualizar, puesto que hay varios mercaderes de mismo nombre.", async () => {
    await request(app)
      .post("/mercaderes")
      .send({
        id: 1,
        nombre: "Daniel",
        tipo: "Mercader general",
        ubicacion: "Novigrado"
      })
      .expect(201);
    await request(app)
      .post("/mercaderes")
      .send({
        id: 2,
        nombre: "Daniel",
        tipo: "Mercader general",
        ubicacion: "Novigrado"
      })
      .expect(201);
    await request(app)
      .patch("/mercaderes?nombre=Daniel")
      .send({
        nombre: "Fran",
        tipo: "Herrero",
        ubicacion: "Skellige"
      })
      .expect(403);
  });
});

describe("PATCH /mercaderes?query, 200", () => {
  test("Debería actualizar correctamente mercaderes.", async () => {
    await request(app)
      .post("/mercaderes")
      .send({
        id: 1,
        nombre: "Daniel",
        tipo: "Mercader general",
        ubicacion: "Novigrado"
      })
      .expect(201);
    await request(app)
      .patch(`/mercaderes?nombre=Daniel`)
      .send({
        nombre: "Fran",
        tipo: "Herrero",
        ubicacion: "Skellige"
      })
      .expect(200);
  });
});

describe("PATCH /mercaderes?query, 401", () => {
  test("Debería prohibir la actualizacion del mercader.", async () => {
    await request(app)
      .post("/mercaderes")
      .send({
        id: 1,
        nombre: "Daniel",
        tipo: "Mercader general",
        ubicacion: "Novigrado"
      })
      .expect(201);
    const mercader = await Mercader.findOne({ nombre: "Daniel" });
    const id = mercader._id;
    await request(app)
      .patch(`/mercaderes/${id}`)
      .send({
        id: 3,
        nombre: "Fran",
        tipo: "Herrero",
        ubicacion: "Skellige"
      })
      .expect(401);
  });
});
