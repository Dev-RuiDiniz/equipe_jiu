import { PrismaClient, Papel } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@equipejiu.com';
  const professorEmail = 'professor@equipejiu.com';

  const [adminHash, professorHash] = await Promise.all([
    bcrypt.hash('Admin@123', 10),
    bcrypt.hash('Professor@123', 10),
  ]);

  await prisma.usuario.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      nome: 'Administrador Equipe Jiu',
      email: adminEmail,
      senhaHash: adminHash,
      papel: Papel.admin,
    },
  });

  await prisma.usuario.upsert({
    where: { email: professorEmail },
    update: {},
    create: {
      nome: 'Professor Equipe Jiu',
      email: professorEmail,
      senhaHash: professorHash,
      papel: Papel.professor,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
