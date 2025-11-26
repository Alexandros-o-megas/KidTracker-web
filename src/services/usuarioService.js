import api from './api';

export const usuarioService = {
  /**
   * Obtém todos os utilizadores com o perfil de motorista
   */
  async getAllMotoristas() {
    // A chamada ao endpoint protegido /api/admin/*
    const response = await api.get('/admin/motoristas');
    return response.data;
  }
};