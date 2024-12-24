import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/database";

// type Data = {
//   message: string;
// };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const figurinos = await prisma.figurino.findMany();
        res.status(200).json(figurinos);
      } catch (error) {
        res.status(500).json({ error: "Erro ao listar figurinos" });
      }
      break;

    case "POST":
      try {
        const { nome, descricao, tamanho, quantidade } = req.body;
        const newFigurino = await prisma.figurino.create({
          data: {
            nome: nome,
            descricao: descricao,
            tamanho: tamanho,
            quantidade: +quantidade,
          },
        });
        res.status(201).json(newFigurino);
      } catch {
        res.status(500).json({ error: "Erro ao criar figurino. " });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Método ${method} não permitido`);
  }
}
