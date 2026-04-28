import { GraduacoesService } from './graduacoes.service';

describe('GraduacoesService', () => {
  it('deve criar graduacao', async () => {
    const prisma = {
      graduacao: {
        create: jest.fn().mockResolvedValue({ id: 'g1', faixa: 'Azul', grau: 1 }),
      },
    };

    const service = new GraduacoesService(prisma as never);
    const result = await service.create({
      alunoId: 'aluno-1',
      faixa: 'Azul',
      grau: 1,
      dataGraduacao: '2026-04-01',
      professorId: 'prof-1',
      observacao: 'ok',
    });

    expect(result.id).toBe('g1');
  });
});
