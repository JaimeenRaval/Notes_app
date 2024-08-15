import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const host = "localhost:3000";

const app = express();
const prisma = new PrismaClient();
app.use(express.json());
app.use(cors());

app.get("/api/notes", async (req, res) =>{
  const notes = await prisma.note.findMany();
  res.json(notes)
});

app.post("/api/notes", async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).send("Title and content fields are required");
  }
  try {
    const note = await prisma.note.create({
      data: { title, content },
    });
    res.json(note);
  } catch (error) {
    console.error(error); // Log the actual error for debugging
    res.status(500).send("Something went wrong while creating the note");
  }
});

app.put('/api/notes/:id', async (req, res) => {
  const { title, content } = req.body;
  const id = req.params.id; // id should be a string

  if (!title || !content) {
    return res.status(400).send("Title and content fields are required");
  }

  if (!id) {
    return res.status(400).send("ID is required");
  }

  try {
    const updatedNote = await prisma.note.update({
      where: { id },
      data: { title, content },
    });
    res.json(updatedNote);
  } catch (error) {
    console.error(error); // Log the actual error for debugging
    res.status(500).send("Something went wrong while updating the note");
  }
});
app.delete('/api/notes/:id',async (req, res)=>{
  const id = parseInt(req.params.id);
  
  if (!id || isNaN(id))
  {
    res .status(400).send("id is not exist")
  }

  try{
    const id = req.params.id; // id should be a string
    await prisma.note.delete({
      where:{id},

    });
    res.status(204).send();
  } catch (error){
    res
      .status(500)
      .send("opps, somethis is wrong");
  }
});
app.listen(3000, () => {
  console.log(`Server running on ${host}`);
});
