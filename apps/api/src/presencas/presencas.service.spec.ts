import { PresencasService } from './presencas.service';

describe('PresencasService', () => {
  it('deve registrar presenca com upsert quando presente=true', async () => {
    const upsert = jest.fn().mockResolvedValue({ id: 'presenca-1' });
    const service = new PresencasService({ presenca: { upsert } } as never);

    const result = await service.registrar({
      aulaId: 'aula-1',
      alunoId: 'aluno-1',
      presente: true,
      observacao: 'ok',
    });

    expect(upsert).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ id: 'presenca-1' });
  });

  it('deve remover presenca quando presente=false', async () => {
    const deleteMany = jest.fn().mockResolvedValue({ count: 1 });
    const service = new PresencasService({ presenca: { deleteMany } } as never);

    const result = await service.registrar({
      aulaId: 'aula-2',
      alunoId: 'aluno-2',
      presente: false,
    });

    expect(deleteMany).toHaveBeenCalledWith({
      where: {
        aulaId: 'aula-2',
        alunoId: 'aluno-2',
      },
    });
    expect(result).toEqual({
      aulaId: 'aula-2',
      alunoId: 'aluno-2',
      presente: false,
    });
  });
});
