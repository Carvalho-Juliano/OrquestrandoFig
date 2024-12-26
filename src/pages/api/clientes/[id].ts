import prisma from "@/database";
import { error } from "console";
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
        const cliente = await prisma.cliente.findUnique({
          where: { id: +id },
        });

        if (!cliente) {
          return res.status(404).json({ error: "Cliente nao encontrado" });
        }
        res.status(200).json(cliente);
      } catch (error) {
        res.status(500).json({ error: "Erro ao buscar cliente. " });
      }

    case "PUT":
      try {
        const { nome, email, telefone } = req.body;

        const cliente = await prisma.cliente.findUnique({
          where: { id: +id },
        });

        if (!cliente) {
          return res.status(404).json({ error: "Cliente nao encontrado" });
        }

        const updateCliente = await prisma.cliente.update({
          where: { id: +id },
          data: {
            nome: nome,
            email: email,
            telefone: telefone,
          },
        });
        res.status(200).json(updateCliente);
      } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar cliente." });
      }
      break;

    case "DELETE":
      try {
        const cliente = await prisma.cliente.findUnique({
          where: { id: +id },
        });

        if (!cliente) {
          return res.status(404).json({ error: "Cliente nao encontrado" });
        }

        const deleteCliente = await prisma.cliente.delete({
          where: { id: +id },
        });
      } catch (error) {
        res.status(500).json({ error: "Erro ao excluir cliente. " });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Método ${method} não permitido`);
  }
}
