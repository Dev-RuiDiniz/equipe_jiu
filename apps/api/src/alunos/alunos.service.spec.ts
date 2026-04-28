import { AlunosService } from './alunos.service';

describe('AlunosService', () => {
  it('deve atualizar status do aluno', async () => {
    const prisma = {
      aluno: {
        findUnique: jest.fn().mockResolvedValue({ id: 'aluno-1', graduacoes: [] }),
        update: jest.fn().mockResolvedValue({ id: 'aluno-1', ativo: false }),
      },
    };

    const service = new AlunosService(prisma as never);
    const result = await service.updateStatus('aluno-1', { ativo: false });

    expect(result.ativo).toBe(false);
  });
});
