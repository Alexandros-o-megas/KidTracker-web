import api from './api';

export const usuarioService = {
  async getAllMotoristas() {
    const response = await api.get('/admin/motoristas');
    return response.data;
  }
};