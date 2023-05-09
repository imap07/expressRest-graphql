const express = require("express");
const userController = require("../controllers/user.controller");

const app = express();

// Definir rutas
// app.get("/list", userController.getUsers);
// app.get("/:id", userController.getUser);
// app.post("/", userController.create);
// app.put("/:id", userController.update);
// app.delete("/:id", userController.delete);

module.exports = app;