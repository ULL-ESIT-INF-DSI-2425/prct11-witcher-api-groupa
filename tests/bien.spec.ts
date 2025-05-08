import { describe, test, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { Bien } from "../src/models/bien.js";

// Borrar la base de datos antes de cada prueba
beforeEach(async () => {
  await Bien.deleteMany();
});

//// TESTS DE POST ////
describe("POST /bienes, 201", () => {
  test("Debería crea un nuevo bien correctamente.", async () => {
    await request(app)
      .post("/bienes")
      .send({
        id: 1,
        nombre: "Espada",
        descripcion: "Espada de acero",
        material: "Acero de Mahakam",
        peso: 1.5,
        valor: 100
      })
      .expect(201);
  });
});

describe("POST /bienes, 401", () => {
  test("Debería fallar en crea un nuevo bien correctamente.", async () => {
    await request(app)
      .post("/bienes")
      .send({
        id: 1,
        nombre: "Espada",
        descripcion: "Espada de acero",
        material: "Acero de Mahakam",
        peso: 1.5,
        valor: -100
      })
      .expect(401);
  });
});

//// TESTS DE GET ////
describe("GET /bienes, 404", () => {
  test("No debería obtener, puesto que no hay bienes.", async () => {
    await request(app)
      .get("/bienes")
      .expect(404);
  });
});

describe("GET /bienes, 200", () => {
  test("Debería obtener correctamente bienes.", async () => {
    await request(app)
      .post("/bienes")
      .send({
        id: 1,
        nombre: "Espada",
        descripcion: "Espada de acero",
        material: "Acero de Mahakam",
        peso: 1.5,
        valor: 100
      })
      .expect(201);
    await request(app)
      .get("/bienes")
      .expect(200);
  });
});

describe("GET /bienes?query, 404", () => {
  test("No debería obtener, puesto que no hay bienes.", async () => {
    await request(app)
      .get("/bienes?nombre=Espada")
      .expect(404);
  });
});

describe("GET /bienes?query, 200", () => {
  test("Debería obtener correctamente bienes.", async () => {
    await request(app)
      .post("/bienes")
      .send({
        id: 1,
        nombre: "Espada",
        descripcion: "Espada de acero",
        material: "Acero de Mahakam",
        peso: 1.5,
        valor: 100
      })
      .expect(201);
    await request(app)
      .get("/bienes?nombre=Espada")
      .expect(200);
  });
});

describe("GET /bienes/:id, 404", () => {
  test("No debería obtener, puesto que no hay bienes.", async () => {
    await request(app)
      .get("/bienes/123456789012345678901234")
      .expect(404);
  });
});

describe("GET /bienes/:id, 200", () => {
  test("Debería obtener correctamente bienes.", async () => {
    await request(app)
      .post("/bienes")
      .send({
        id: 1,
        nombre: "Espada",
        descripcion: "Espada de acero",
        material: "Acero de Mahakam",
        peso: 1.5,
        valor: 100
      })
      .expect(201);
    const bien = await Bien.findOne({ nombre: "Espada" });
    const id = bien._id
    await request(app)
      .get(`/bienes/${id}`)
      .expect(200);
  });
});

//// TESTS DE DELETE ////
describe("DELETE /bienes/:id, 404", () => {
  test("No debería eliminar, puesto que no hay bienes.", async () => {
    await request(app)
      .delete("/bienes/123456789012345678901234")
      .expect(404);
  });
});

describe("DELETE /bienes/:id, 200", () => {
  test("Debería eliminar correctamente bienes.", async () => {
    await request(app)
      .post("/bienes")
      .send({
        id: 1,
        nombre: "Espada",
        descripcion: "Espada de acero",
        material: "Acero de Mahakam",
        peso: 1.5,
        valor: 100
      })
      .expect(201);
    const bien = await Bien.findOne({ nombre: "Espada" });
    const id = bien._id
    await request(app)
      .delete(`/bienes/${id}`)
      .expect(200);
  });
});

describe("DELETE /bienes?query, 404", () => {
  test("No debería eliminar, puesto que no hay bienes.", async () => {
    await request(app)
      .delete("/bienes?nombre=Espada")
      .expect(404);
  });
});

describe("DELETE /bienes?query, 403", () => {
  test("No debería eliminar, puesto que hay más de un bien con ese nombre.", async () => {
    await request(app)
      .post("/bienes")
      .send({
        id: 1,
        nombre: "Espada",
        descripcion: "Espada de acero",
        material: "Acero de Mahakam",
        peso: 1.5,
        valor: 100
      })
      .expect(201);
    await request(app)
      .post("/bienes")
      .send({
        id: 2,
        nombre: "Espada",
        descripcion: "Espada de acero",
        material: "Acero de Mahakam",
        peso: 1.5,
        valor: 100
      })
      .expect(201);
    await request(app)
      .delete("/bienes?nombre=Espada")
      .expect(403);
  });
});

describe("DELETE /bienes?query, 200", () => {
    test("Debería eliminar correctamente bienes.", async () => {
      await request(app)
        .post("/bienes")
        .send({
          id: 1,
          nombre: "Espada",
          descripcion: "Espada de acero",
          material: "Acero de Mahakam",
          peso: 1.5,
          valor: 100
        })
        .expect(201);
      await request(app)
        .delete("/bienes?nombre=Espada")
        .expect(200);
    });
  });

//// TESTS DE PATCH ////
describe("PATCH /bienes/:id, 404", () => {
  test("No debería actualizar, puesto que no hay bienes.", async () => {
    await request(app)
      .patch("/bienes/123456789012345678901234")
      .send({
        nombre: "Espada",
        descripcion: "Espada de acero",
        material: "Acero de Mahakam",
        peso: 1.5,
        valor: 100
      })
      .expect(404);
  });
});

describe("PATCH /bienes/:id, 200", () => {
  test("Debería actualizar correctamente bienes.", async () => {
    await request(app)
      .post("/bienes")
      .send({
        id: 1,
        nombre: "Espada",
        descripcion: "Espada de acero",
        material: "Acero de Mahakam",
        peso: 1.5,
        valor: 100
      })
      .expect(201);
    const bien = await Bien.findOne({ nombre: "Espada" });
    const id = bien._id
    await request(app)
      .patch(`/bienes/${id}`)
      .send({
        nombre: "Espada",
        descripcion: "Espada de acero",
        material: "Acero de Mahakam",
        peso: 1.5,
        valor: 100
      })
      .expect(200);
  });
});

describe("PATCH /bienes/:id, 401", () => {
  test("Debería prohibir la actualización del bien.", async () => {
    await request(app)
        .post("/bienes")
        .send({
          id: 1,
          nombre: "Espada",
          descripcion: "Espada de acero",
          material: "Acero de Mahakam",
          peso: 1.5,
          valor: 100
        })
        .expect(201);
    const bien = await Bien.findOne({ nombre: "Espada" });
    const id = bien._id
    await request(app)
      .patch(`/bienes/${id}`)
      .send({
        id: 3,
        nombre: "Espada",
        descripcion: "Espada de acero",
        material: "Acero de Mahakam",
        peso: 1.5,
        valor: -100
      })
      .expect(401);
  });
});

describe("PATCH /bienes?query, 404", () => {
    test("No debería actualizar, puesto que no hay bienes.", async () => {
        await request(app)
        .patch("/bienes?nombre=Espada")
        .send({
            nombre: "Espada",
            descripcion: "Espada de acero",
            material: "Acero de Mahakam",
            peso: 1.5,
            valor: 100
        })
        .expect(404);
    });
});

describe("PATCH /bienes?query, 403", () => {
    test("No debería actualizar, puesto que hay más de un bien con ese nombre.", async () => {
        await request(app)
        .post("/bienes")
        .send({
            id: 1,
            nombre: "Espada",
            descripcion: "Espada de acero",
            material: "Acero de Mahakam",
            peso: 1.5,
            valor: 100
        })
        .expect(201);
        await request(app)
        .post("/bienes")
        .send({
            id: 2,
            nombre: "Espada",
            descripcion: "Espada de acero",
            material: "Acero de Mahakam",
            peso: 1.5,
            valor: 120
        })
        .expect(201);
        await request(app)
        .patch("/bienes?nombre=Espada")
        .send({
            nombre: "Espada",
            descripcion: "Espada de acero maldita",
            material: "Acero de Mahakam",
            peso: 1.5,
            valor: 100
        })
        .expect(403);
    });
});

describe("PATCH /bienes?query, 200", () => {
    test("Debería actualizar correctamente bienes.", async () => {
        await request(app)
        .post("/bienes")
        .send({
            id: 1,
            nombre: "Espada",
            descripcion: "Espada de acero",
            material: "Acero de Mahakam",
            peso: 1.5,
            valor: 100
        })
        .expect(201);
        await request(app)
        .patch("/bienes?nombre=Espada")
        .send({
            nombre: "Espada",
            descripcion: "Espada de acero maldita",
            material: "Acero de Mahakam",
            peso: 1.5,
            valor: 100
        })
        .expect(200);
    });
});

describe("PATCH /bienes?query, 401", () => {
    test("Debería prohibir la actualización del bien.", async () => {
        await request(app)
            .post("/bienes")
            .send({
                id: 1,
                nombre: "Espada",
                descripcion: "Espada de acero",
                material: "Acero de Mahakam",
                peso: 1.5,
                valor: 100
            })
            .expect(201);
        await request(app)
            .patch("/bienes?nombre=Espada")
            .send({
                id: 3,
                nombre: "Espada",
                descripcion: "Espada de acero",
                material: "Acero de Mahakam",
                peso: 1.5,
                valor: -100
            })
            .expect(401);
    });
});

