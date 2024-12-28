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
        const emprestimo = await prisma.emprestimo.findUnique({
          where: {
            id: +id,
          },
          include: {
            cliente: true,
            figurino: true,
          },
        });

        if (!emprestimo) {
          return res.status(404).json({ error: "Emprestimo nao encontrado " });
        }

        res.status(200).json(emprestimo);
      } catch (error) {
        res.status(500).json({ error: "Erro ao buscar emprestimo" });
      }
      break;

    case "PUT":
      try {
        const { dataInicio, dataFim, figurinoId, clienteId } = req.body;

        const emprestimo = await prisma.emprestimo.findUnique({
          where: { id: +id },
        });

        if (!emprestimo) {
          return res.status(404).json({ error: "Emprestimo nao encontrado" });
        }

        const atualizarEmprestimo = await prisma.emprestimo.update({
          where: { id: +id },
          data: {
            dataInicio: dataInicio,
            dataFim: dataFim,
            figurinoId: figurinoId,
            clienteId: clienteId,
          },
        });
        res.status(200).json(atualizarEmprestimo);
      } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar emprestimo" });
      }
      break;

    case "DELETE":
      try {
        const emprestimo = await prisma.emprestimo.findUnique({
          where: {
            id: +id,
          },
        });

        if (!emprestimo) {
          return res.status(404).json({ error: "Emprestimo nao encontrado" });
        }

        const deleteEmprestimo = await prisma.emprestimo.delete({
          where: { id: +id },
        });
        res.status(200).json(deleteEmprestimo);
      } catch (error) {
        res.status(500).json({ error: "Erro ao excluir emprestimo " });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Método ${method} não permitido`);
  }
}
