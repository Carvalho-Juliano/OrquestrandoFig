import prisma from "@/database";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "ID inválido" });
  }

  switch (method) {
    case "GET":
      try {
        const figurino = await prisma.figurino.findUnique({
          where: { id: Number(id) },
        });

        if (!figurino) {
          return res.status(404).json({ error: "Figurino nao encontrado" });
        }
        res.status(200).json(figurino);
      } catch (error) {
        res.status(500).json({ error: "Erro ao buscar figurino. " });
      }
      break;

    case "PUT":
      try {
        const { nome, descricao, tamanho, quantidade } = req.body;
        const updateFigurino = await prisma.figurino.update({
          where: { id: Number(id) },
          data: {
            nome,
            descricao,
            tamanho,
            quantidade,
          },
        });
        res.status(200).json(updateFigurino);
      } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar figurino." });
      }
      break;

    case "DELETE":
      try {
        const figurino = await prisma.figurino.findUnique({
          where: { id: Number(id) },
        });

        if (!figurino) {
          return res.status(404).json({ error: "figurino nao encontrado" });
        }

        const deleteFigurino = await prisma.figurino.delete({
          where: { id: Number(id) },
        });
        res.status(200).json(deleteFigurino);
      } catch (error) {
        res.status(500).json({ error: "Erro ao excluir figurino. " });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Método ${method} não permitido`);
  }
}
