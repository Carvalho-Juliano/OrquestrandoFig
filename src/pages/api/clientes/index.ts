import prisma from "@/database";
import { NextApiRequest, NextApiResponse } from "next";
import { deflateRaw } from "zlib";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const cliente = await prisma.cliente.findMany();
        res.status(200).json(cliente);
      } catch (error) {
        res.status(500).json({ error: "Erro ao listar figurinos" });
      }
      break;

    case "POST":
      try {
        const { nome, email, telefone } = req.body;
        const newCliente = await prisma.cliente.create({
          data: {
            nome: nome,
            email: email,
            telefone: telefone,
          },
        });
        res.status(201).json(newCliente);
      } catch (error) {
        res.status(500).json({ error: "Erro ao criar figurino" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Metodo ${method} não permitido`);
  }
}
