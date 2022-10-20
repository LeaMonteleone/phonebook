const { json } = require("express");
const express = require("express");
const cors = require("cors");
const app = express();
var morgan = require("morgan");

app.use(express.json());
app.use(express.static("build"));
app.use(cors());
app.use(morgan("tiny"));

let persons = [
  { id: 0, name: "Lenadro Monteleone", number: 1 },
  { id: 1, name: "Pedro Alfonso", number: 455 },
  { id: 2, name: "Flor Corral", number: 55 },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  response.send(`
    <div>
      <p>La agenda tiene ${persons.length} contactos</p>
      <p>${Date()}</p>
    </div>`);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    response.status(400).send({ error: "Falta nombre o numero" }).end();
  } else if (persons.some((person) => person.name == body.name)) {
    response.status(400).json({ error: "El nombre esta repetido" }).end();
  } else {
    const person = {
      id: Math.floor(Math.random() * (9999999 - 0) + 0),
      name: body.name,
      number: body.number,
    };
    persons = persons.concat(person);

    response.json(person);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
