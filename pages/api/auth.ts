// ✅ auth.ts - Authentication API with Role-based Registration/Login (Prisma + Next.js)

// import { PrismaClient } from '@prisma/client';
// import type { NextApiRequest, NextApiResponse } from 'next';
// import bcrypt from 'bcryptjs';

// const prisma = new PrismaClient();

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     const { action, email, password, name, role } = req.body;

//     if (!['user', 'doctor', 'admin'].includes(role)) return res.status(400).json({ error: 'Invalid role' });
//     if (!email || !password || (action === 'register' && !name)) return res.status(400).json({ error: 'Missing fields' });

//     if (action === 'register') {
//       const existing = await prisma.user.findUnique({ where: { email } });
//       if (existing) return res.status(409).json({ error: 'Email already registered' });

//       const hashedPassword = await bcrypt.hash(password, 10);
//       const newUser = await prisma.user.create({
//         data: { email, name, role, password: hashedPassword },
//       });
//       return res.status(201).json({ message: 'User registered', user: { email: newUser.email, role: newUser.role } });
//     }

//     if (action === 'login') {
//       const user = await prisma.user.findUnique({ where: { email } });
//       if (!user) return res.status(401).json({ error: 'Invalid email or password' });

//       const match = await bcrypt.compare(password, user.password);
//       if (!match) return res.status(401).json({ error: 'Invalid email or password' });

//       return res.status(200).json({ message: 'Login success', user: { email: user.email, role: user.role, name: user.name } });
//     }
//   }

//   return res.status(405).json({ error: 'Method not allowed' });
// }    




// 2


// pages/api/auth.ts
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { action, name, email, password, role } = req.body;

  if (!email || !password || (action === "register" && (!name || !role))) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const emailLower = email.toLowerCase();

  try {
    if (action === "register") {
      const emailLower = email.toLowerCase();
      const hashedPassword = await bcrypt.hash(password, 10);
    
      if (role === "user") {
        const existing = await prisma.user.findUnique({ where: { email: emailLower } });
        if (existing) return res.status(409).json({ error: "Email already registered" });
    
        await prisma.user.create({
          data: { email: emailLower, password: hashedPassword, name },
        });
        return res.status(201).json({ message: "Registered", role: "user" });
      }
    
      if (role === "doctor") {
        const existing = await prisma.doctor.findUnique({ where: { email: emailLower } });
        if (existing) return res.status(409).json({ error: "Email already registered" });
    
        await prisma.doctor.create({
          data: { email: emailLower, password: hashedPassword, name, specialty: "General" },
        });
        return res.status(201).json({ message: "Registered", role: "doctor" });
      }
    
      if (role === "admin") {
        const existing = await prisma.admin.findUnique({ where: { email: emailLower } });
        if (existing) return res.status(409).json({ error: "Email already registered" });
    
        await prisma.admin.create({
          data: { email: emailLower, password: hashedPassword, name },
        });
        return res.status(201).json({ message: "Registered", role: "admin" });
      }
    
      return res.status(400).json({ error: "Invalid role" });
    }
    
    if (action === "login") {
      // Try to find email in all 3 tables
      const user = await prisma.user.findUnique({ where: { email: emailLower } });
      const doctor = await prisma.doctor.findUnique({ where: { email: emailLower } });
      const admin = await prisma.admin.findUnique({ where: { email: emailLower } });

      const account = user || doctor || admin;
      const foundRole = user ? "user" : doctor ? "doctor" : admin ? "admin" : null;

      if (!account || !foundRole) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const match = await bcrypt.compare(password, account.password);
      if (!match) return res.status(401).json({ error: "Invalid email or password" });

      return res.status(200).json({ message: "Login success", role: foundRole });
    }

    return res.status(400).json({ error: "Invalid action" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}





