import prisma from "@/database";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const emprestimo = await prisma.emprestimo.findMany({
          include: {
            cliente: true,
            figurino: true,
          },
        });
        res.status(200).json(emprestimo);
      } catch (error) {
        res.status(500).json({ error: "Erro ao listar emprestimos" });
      }
      break;

    case "POST":
      try {
        const { figurinoId, clienteId, dataInicio, dataFim } = req.body;

        if (!figurinoId || !clienteId || !dataInicio || !dataFim) {
          return res
            .status(400)
            .json({ error: "Informe todos os campos obrigatórios" });
        }

        const newEmprestimo = await prisma.emprestimo.create({
          data: {
            figurinoId: +figurinoId,
            clienteId: +clienteId,
            dataInicio: new Date(dataInicio),
            dataFim: new Date(dataFim),
          },
        });
        res.status(201).json(newEmprestimo);
      } catch (error) {
        res.status(500).json({ error: "Erro ao criar empréstimo." });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Método ${method} não permitido`);
  }
}
