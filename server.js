/********************************************************************************
*  WEB322 – Assignment 05
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Rojan KC      Student ID: 171714231      Date: 2025-07-27
*
*  Published URL: ___________________________________________________________
*
********************************************************************************/

const express = require("express");
const path = require("path");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

const projectService = require("./modules/projects");

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

// Home
app.get("/", (req, res) => {
  res.redirect("/solutions/projects");
});

// View All Projects
app.get("/solutions/projects", async (req, res) => {
  try {
    const projects = await projectService.getAllProjects();
    res.render("projects", { projects });
  } catch (err) {
    res.render("500", { message: `Server error: ${err.message}` });
  }
});

// View Single Project
app.get("/solutions/project/:id", async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    res.render("project", { project });
  } catch (err) {
    res.status(404).render("404", { message: err.message });
  }
});

// Filter by Sector
app.get("/solutions/sectors/:sector", async (req, res) => {
  try {
    const projects = await projectService.getProjectsBySector(req.params.sector);
    res.render("projects", { projects });
  } catch (err) {
    res.status(404).render("404", { message: err.message });
  }
});

// GET Add Project Page
app.get("/solutions/addProject", async (req, res) => {
  try {
    const sectors = await projectService.getAllSectors();
    res.render("addProject", { sectors });
  } catch (err) {
    res.render("500", { message: `Error: ${err.message}` });
  }
});

// POST Add Project
app.post("/solutions/addProject", async (req, res) => {
  try {
    await projectService.addProject(req.body);
    res.redirect("/solutions/projects");
  } catch (err) {
    res.render("500", { message: `Error: ${err.message}` });
  }
});

// GET Edit Project Page
app.get("/solutions/editProject/:id", async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    const sectors = await projectService.getAllSectors();
    res.render("editProject", { project, sectors });
  } catch (err) {
    res.status(404).render("404", { message: err.message });
  }
});

// POST Edit Project
app.post("/solutions/editProject", async (req, res) => {
  try {
    await projectService.editProject(req.body.id, req.body);
    res.redirect("/solutions/projects");
  } catch (err) {
    res.render("500", { message: `Error: ${err.message}` });
  }
});

// Delete Project
app.get("/solutions/deleteProject/:id", async (req, res) => {
  try {
    await projectService.deleteProject(req.params.id);
    res.redirect("/solutions/projects");
  } catch (err) {
    res.render("500", { message: `Error: ${err.message}` });
  }
});

// 404 Route
app.use((req, res) => {
  res.status(404).render("404", { message: "Page not found" });
});

// Start server
projectService.initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => console.log(`Server listening on port ${HTTP_PORT}`));
  })
  .catch(err => {
    console.error("Initialization failed:", err);
  });
