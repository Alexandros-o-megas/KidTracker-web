import api from './api';

export const viagemService = {
  async getMinhaProximaViagem() {
    const response = await api.get('/viagens/motorista/proxima'); 
    return response.data;
  },

  async notificarChegada(pontoParagemId) {
    await api.post(`/viagens/paragens/${pontoParagemId}/cheguei`);
  }
};