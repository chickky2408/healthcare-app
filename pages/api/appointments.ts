// pages/api/appointments.ts
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const appointments = await prisma.appointment.findMany();
    return res.status(200).json(appointments);
  }

  if (req.method === 'POST') {
    const { patient, doctor, date, reason } = req.body;
    const newAppointment = await prisma.appointment.create({
      data: { patient, doctor, date: new Date(date), reason },
    });
    return res.status(201).json(newAppointment);
  }

  res.status(405).end(); // Method Not Allowed
}
