import { AulasService } from './aulas.service';

describe('AulasService', () => {
  it('deve cancelar aula existente', async () => {
    const prisma = {
      aula: {
        findUnique: jest.fn().mockResolvedValue({ id: 'a1' }),
        update: jest.fn().mockResolvedValue({ id: 'a1', cancelada: true }),
      },
    };

    const service = new AulasService(prisma as never);
    const result = await service.cancelar('a1');

    expect(prisma.aula.update).toHaveBeenCalledWith({ where: { id: 'a1' }, data: { cancelada: true } });
    expect(result.cancelada).toBe(true);
  });
});
