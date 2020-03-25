// Import controller
const AssemblyController = require("../controllers/assembly.controller");

// Exports routes to be called in server.js
module.exports = app => {
    app.post("/api/assembly/new", AssemblyController.create);
    app.get("/api/assembly/", AssemblyController.getAll);
    app.get("/api/assembly/:id", AssemblyController.getOne);
    app.put("/api/assembly/update/:id", AssemblyController.update);
    app.put("/api/assembly/update/:id/addTeammate", AssemblyController.addTeammate);
    app.delete("/api/assembly/delete/:id", AssemblyController.delete);
};

/* 

Note: Assemblies are made with no teammates by default. 

Adding a teammate: .put /addTeammate route
Editing teammate info: spread ALL of team with desired param changed
Removing a teammate: spread ALL of team except the teammate to remove

>>> In the future, is it possible/better to write dedicated controllers for updating/destroying a nested model? <<<

*/