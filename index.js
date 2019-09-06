const express = require('express');
const server = express();

server.use(express.json());

const projects = [];
let totalRequest = 0;

/**
 *  Middleware que verifica se o projeto existe
 */
function checkProjectExists (req, res, next) {
  const { id } = req.params;
  const projectExists = projects.find(p => p.id == id);

  if(!projectExists) {
    return res.status(400).json({error: 'Project not found.'})
  }

  return next();
}

/**
 *  Middleware responsável pelo total de requisições
 */
function logTotalRequest(req,res,next) {
  totalRequest ++;
  console.log(`Número de Request: ${totalRequest}`);
  return next();
}

server.use(logTotalRequest);


//Cadastrar Novo Projeto
server.post('/projects', (req, res) => {
  const { id, title } = req.body;
  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);
  return res.json(projects)
});

// Cadastrar tarefas dentro de um projeto
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);
  return res.json(projects)
});

// Listar todos os projetos e tarefas
server.get('/projects', (req, res) => {
  return res.json(projects);
});

// Alterar apenas o title do projeto 
server.put('/projects/:id', checkProjectExists, (req,res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(projects);

});

// Deletar um projeto
server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const {id} = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);
  projects.splice(projectIndex,1);
  return res.send();
}); 

server.listen(3000);