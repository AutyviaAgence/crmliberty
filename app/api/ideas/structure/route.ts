import { NextRequest } from "next/server";
import { getAuthenticatedUser, unauthorizedResponse, successResponse, errorResponse } from "@/lib/api-utils";

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) return unauthorizedResponse();

  const { raw_text } = await req.json();
  if (!raw_text) return errorResponse("raw_text est requis");

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return errorResponse("Clé OpenAI non configurée", 500);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Tu es un assistant business pour une agence marketing/tech appelée WeHill.
L'utilisateur va te donner une idée brute, souvent écrite de manière informelle.
Tu dois la structurer en JSON avec exactement ce format:
{
  "title": "Titre clair et professionnel de l'idée",
  "structured_description": "Description détaillée et structurée de l'idée, avec contexte, objectif, et bénéfices attendus. 2-3 paragraphes.",
  "actions": ["Action concrète 1", "Action concrète 2", "Action concrète 3", "Action concrète 4"]
}
Réponds UNIQUEMENT avec le JSON, pas de texte autour. Les actions doivent être concrètes et actionnables.`,
          },
          {
            role: "user",
            content: raw_text,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return errorResponse(`Erreur OpenAI: ${errorData.error?.message || "Inconnue"}`, 500);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) return errorResponse("Pas de réponse d'OpenAI", 500);

    const structured = JSON.parse(content);

    return successResponse({
      title: structured.title,
      structured_description: structured.structured_description,
      actions: structured.actions,
    });
  } catch (err: any) {
    return errorResponse(`Erreur structuration: ${err.message}`, 500);
  }
}
