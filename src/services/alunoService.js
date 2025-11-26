import api from './api';

export const alunoService = {
  async getAll() {
    const response = await api.get('/admin/alunos');
    return response.data;
  }
};