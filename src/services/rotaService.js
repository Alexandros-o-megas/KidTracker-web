import api from './api';

export const rotaService = {
  async getAll() {
    const response = await api.get('/admin/rotas');
    return response.data;
  }
};