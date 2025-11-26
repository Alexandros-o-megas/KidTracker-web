import api from './api';

export const encarregadoService = {
  /**
   * Vai buscar todos os dados necessários para o painel do encarregado.
   * A chamada é protegida, o axios interceptor irá adicionar o token JWT.
   */
  async getPainelData() {
    const response = await api.get('/encarregado/painel');
    return response.data;
  }
};