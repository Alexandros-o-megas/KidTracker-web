import api from './api';

export const rotaService = {
  /**
   * Obtém a rota atualmente ativa para o motorista autenticado.
   */
  async getMinhaRotaAtiva() {
    // Este serviço depende da criação do endpoint no backend,
    // por exemplo, num `RotaController`.
    const response = await api.get('/rotas/motorista/ativa');
    return response.data;
  }
};