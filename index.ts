import express from "express";
import { GoogleAuth } from "google-auth-library";
import axios from "axios";

const app = express();
app.use(express.json());

app.post("/webhook", async (req: express.Request, res: express.Response) => {

  try {
    const prompt: string = req.body?.prompt || "Olá";


    const auth = new GoogleAuth({
      scopes: "https://www.googleapis.com/auth/cloud-platform",
    });

    const client = await auth.getClient();
    const projectId = await auth.getProjectId();

    const endpoint = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/gemini-1.5-flash:streamGenerateContent`;

    const vertexBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    };

const response = await client.request<{
  [x: string]: any;
  data: {
    candidates: {
      content: {
        parts: { text: string }[]
      }
    }[]
  }
}>({
  url: endpoint,
  method: "POST",
  data: vertexBody,
});


   const result = response.data.candidates?.[0]?.content.parts?.[0]?.text || "Erro ao gerar resposta.";
    res.json({ resposta: result });

  } catch (error) {
    console.error(error);
    const errorMessage = (error instanceof Error) ? error.message : "Erro interno";
    res.status(500).send({ error: errorMessage });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});
