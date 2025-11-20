import api from './api';

// As funções do backend devem corresponder a estas chamadas.
// Ex: GET /api/veiculos deve retornar uma lista de veículos.
export const veiculoService = {
  async getAll() {
    const response = await api.get('/veiculos');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/veiculos/${id}`);
    return response.data;
  },

  async create(veiculoData) {
    const response = await api.post('/veiculos', veiculoData);
    return response.data;
  },

  async update(id, veiculoData) {
    const response = await api.put(`/veiculos/${id}`, veiculoData);
    return response.data;
  },

  async delete(id) {
    await api.delete(`/veiculos/${id}`);
  }
};