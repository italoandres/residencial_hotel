
const express = require('express');
const app = express();
app.use(express.json());

// mock data
let quartos = [
  { id: 1, nome: "Quarto 1", status: "disponivel", preco: 80, fotos: [] },
  { id: 2, nome: "Quarto 2", status: "ocupado", preco: 90, fotos: [] }
];

app.get('/quartos', (req, res) => {
  res.json(quartos);
});

app.get('/quartos/:id', (req, res) => {
  const q = quartos.find(x => x.id == req.params.id);
  if (!q) return res.status(404).json({ erro: "não encontrado" });
  res.json(q);
});

app.listen(3000, () => console.log('API rodando na porta 3000'));
