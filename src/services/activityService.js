import api from './api';

export const activityService = {
  /**
   * Obtém as atividades mais recentes diretamente do backend.
   * A resposta da API deve ser um array de objetos Atividade,
   * cada um com { id, tipo, texto, timestamp }.
   */
  async getRecent() {
    try {
      // Faz a chamada real para o nosso novo endpoint.
      const response = await api.get('/activities/recent');
      // O backend devolve um DTO, que aqui é o 'response.data'.
      // Renomeámos o campo `tipo` no frontend para `type` para consistência.
      return response.data.map(activity => ({
        ...activity,
        type: activity.tipo, // Mapeia o campo 'tipo' do backend para 'type'
      }));
    } catch (error) {
      console.error("Falha ao obter atividades do servidor:", error);
      // Em caso de erro, retorna um array vazio para não quebrar a UI.
      return [];
    }
  }
};