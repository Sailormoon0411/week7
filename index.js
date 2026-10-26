import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { JSONFilePreset } from "lowdb/node";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

// init LowDB
const db = await JSONFilePreset(path.join(__dirname, "db.json"), { entries: [] });
await db.write();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// new data
app.post("/new-data", async (req, res) => {
  const { date, mood, note } = req.body || {};

  if (!date || !mood) {
    return res.status(400).json({ error: "date and mood are required" });
  }

  const entry = {
    id: crypto.randomUUID(),
    date,
    mood,
    note: note || "",
    createdAt: new Date().toISOString(),
  };

  db.data.entries.push(entry);
  await db.write();

  res.status(201).json(entry);
});

// get all
app.get("/data", (_req, res) => {
  res.json(db.data.entries);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
