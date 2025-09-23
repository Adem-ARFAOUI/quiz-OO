const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 📌 1. Connexion à MongoDB Atlas
mongoose
  .connect(
    "mongodb+srv://ademarfaoui2018_db_user:HRrhJug6Z6eXDYQX@quiz.ldo7nmy.mongodb.net/?retryWrites=true&w=majority&appName=quiz"
  )
  .then(() => {
    console.log("connection successfuly");
  })
  .catch((error) => {
    console.log("error with connection with the DB", error);
  });

// 📌 2. Modèle de données
const Result = mongoose.model(
  "Result",
  new mongoose.Schema({
    studentId: String,
    score: Number,
  })
);

// 📌 3. Route pour enregistrer un résultat
app.post("/api/results", async (req, res) => {
  const { studentId, score } = req.body;
  const result = new Result({ studentId, score });
  await result.save();
  res.json({ message: "✅ Résultat enregistré !" });
});

// 📌 4. Route pour les statistiques
app.get("/api/stats", async (req, res) => {
  const results = await Result.find();
  if (results.length === 0)
    return res.json({ message: "⚠️ Pas encore de résultats." });

  const scores = results.map((r) => r.score);
  const moyenne = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(
    2
  );

  const compris = scores.filter((s) => s >= 50).length;
  const pourcentageCompris = ((compris / scores.length) * 100).toFixed(2);

  res.json({ moyenne, pourcentageCompris, total: scores.length });
});

// 📌 5. Route pour exporter en JSON
app.get("/api/export", async (req, res) => {
  const results = await Result.find();
  res.json(results);
});

// 🚀 Lancer le serveur
app.listen(3000, () => console.log(" Serveur lancé sur http://localhost:3000"));
