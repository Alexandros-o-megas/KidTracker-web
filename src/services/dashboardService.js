import api from './api';

export const dashboardService = {
  /**
   * Obtém as estatísticas para o dashboard.
   * O backend deve retornar um objeto como: 
   * { totalVeiculos: 10, totalMotoristas: 8, totalAlunos: 150, ... }
   */
  async getStats() {
    const response = await api.get('/dashboard/stats');
    return response.data;
  }
};