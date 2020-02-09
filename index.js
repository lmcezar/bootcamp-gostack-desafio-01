const express = require("express");

const server = express();
server.use(express.json());

const projects = [];

function log(req, res, next) {
  console.count("Count number of requests");
  return next();
}

server.use(log);

server.post("/projects", (req, res) => {
  const proj = req.body;
  projects.push(proj);
  return res.json(projects);
});

server.get("/", (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;

  const project = projects.find(p => p.id == id);
  project.title = title;

  return res.json(project);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.find(p => p.id == id);
  projects.splice(projectIndex, 1);
  return res.send();
});

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id == id);
  project.tasks.push(title);
  return res.send(project);
});

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }
  return next();
}

server.listen(3000);
