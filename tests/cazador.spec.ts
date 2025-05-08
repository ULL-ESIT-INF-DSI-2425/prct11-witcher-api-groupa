import { describe, test, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
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
        raza: "Dragón",
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
      .post("/cazadores")
      .send({
        id: 2,
        nombre: "Fran",
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
      .get("/cazadores/000000000000000000000000")
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
      const cazador = await Cazador.findOne({ nombre: "Daniel" });
      const id = cazador._id;
    await request(app)
      .get(`/cazadores/${id}`)
      .expect(200);
  });
});

//// TESTS DE DELETE ////
describe("DELETE /cazadores/:id, 404", () => {
  test("No debería eliminar, puesto que no hay cazadores.", async () => {
    await request(app)
      .delete("/cazadores/000000000000000000000000")
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
      const cazador = await Cazador.findOne({ nombre: "Daniel" });
      const id = cazador._id;
    await request(app)
      .delete(`/cazadores/${id}`)
      .expect(200);
  });
});

describe("DELETE /cazadores?query, 404", () => {
  test("No debería eliminar, puesto que no hay cazadores.", async () => {
    await request(app)
      .delete("/cazadores?nombre=Fran")
      .expect(404);
  });
});

describe("DELETE /cazadores?query, 403", () => {
  test("No debería eliminar, puesto que hay varios cazadores con el mismo nombre.", async () => {
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
      .post("/cazadores")
      .send({
        id: 2,
        nombre: "Daniel",
        raza: "Humano",
        ubicacion: "Novigrado"
      })
      .expect(201);
    await request(app)
      .delete("/cazadores?nombre=Daniel")
      .expect(403);
  });
});

describe("DELETE /cazadores?query, 200", () => {
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
      .delete("/cazadores?nombre=Daniel")
      .expect(200);
  });
});

//// TESTS DE PATCH ////
describe("PATCH /cazadores/:id, 404", () => {
  test("No debería actualizar, puesto que no hay cazadores.", async () => {
    await request(app)
      .patch("/cazadores/000000000000000000000000")
      .send({
        nombre: "Fran",
        raza: "Humano",
        ubicacion: "Skellige"
      })
      .expect(404);
  });
});

describe("PATCH /cazadores/:id, 200", () => {
  test("Debería actualizar correctamente cazadores.", async () => {
    await request(app)
      .post("/cazadores")
      .send({
        id: 1,
        nombre: "Daniel",
        raza: "Humano",
        ubicacion: "Novigrado"
      })
      .expect(201);
      const cazador = await Cazador.findOne({ nombre: "Daniel" });
      const id = cazador._id;
    await request(app)
      .patch(`/cazadores/${id}`)
      .send({
        nombre: "Fran",
        raza: "Humano",
        ubicacion: "Skellige"
      })
      .expect(200);
  });
});

describe("PATCH /cazadores/:id, 401", () => {
  test("Debería prohibir la actualizacion del cazador.", async () => {
    await request(app)
      .post("/cazadores")
      .send({
        id: 1,
        nombre: "Daniel",
        raza: "Humano",
        ubicacion: "Novigrado"
      })
      .expect(201);
      const cazador = await Cazador.findOne({ nombre: "Daniel" });
      const id = cazador._id;
    await request(app)
      .patch(`/cazadores/${id}`)
      .send({
        id: 3,
        nombre: "Fran",
        raza: "Humano",
        ubicacion: "Skellige"
      })
      .expect(401);
  });
});

describe("PATCH /cazadores?query, 404", () => {
  test("No debería actualizar, puesto que no hay cazadores.", async () => {
    await request(app)
      .patch("/cazadores?nombre=Fran")
      .send({
        id: 1,
        nombre: "Daniel",
        raza: "Humano",
        ubicacion: "Novigrado"
      })
      .expect(404);
  });
});

describe("PATCH /cazadores?query, 403", () => {
  test("No debería actualizar, puesto que hay varios cazadores con el mismo nombre.", async () => {
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
      .post("/cazadores")
      .send({
        id: 2,
        nombre: "Daniel",
        raza: "Humano",
        ubicacion: "Novigrado"
      })
      .expect(201);
    await request(app)
      .patch("/cazadores?nombre=Daniel")
      .send({
        nombre: "Fran",
        raza: "Humano",
        ubicacion: "Novigrado"
      })
      .expect(403);
  });
});

describe("PATCH /cazadores?query, 200", () => {
  test("Debería actualizar correctamente cazadores.", async () => {
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
      .patch("/cazadores?nombre=Daniel")
      .send({
        nombre: "Fran",
        raza: "Humano",
        ubicacion: "Novigrado"
      })
      .expect(200);
  });
});

describe("PATCH /cazadores?query, 200", () => {
  test("Debería prohibir la actualización de cazadores.", async () => {
    await request(app)
      .post("/cazadores")
      .send({
        id: 1,
        nombre: "Daniel",
        raza: "Humano",
        ubicacion: "Novigrado"
      })
      .expect(201);
    const cazador = await Cazador.findOne({ nombre: "Daniel" });
    const id = cazador._id;
    await request(app)
      .patch(`/cazadores/${id}`)
      .send({
        id: 3,
        nombre: "Fran",
        raza: "Humano",
        ubicacion: "Novigrado"
      })
      .expect(200);
  });
});

