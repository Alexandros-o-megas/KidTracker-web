import api from './api';

export const localizacaoService = {
  /**
   * Envia a localização do motorista para o backend.
   * O payload deve corresponder ao LocalizacaoDTO do backend.
   */
  async enviar(veiculoId, localizacaoData) {
    // A API que criamos no backend é /api/localizacoes/veiculo/{veiculoId}
    // mas o AuthController tem /api/auth/**. Vamos usar a de veículos por enquanto.
    const endpoint = `/localizacoes/veiculo/${veiculoId}`;

    const payload = {
        lat: localizacaoData.latitude,
        lon: localizacaoData.longitude,
        velocidade: localizacaoData.speed || 0,
        timestamp: Date.now()
    };
    
    // Este serviço depende da criação do endpoint no `LocalizacaoController` do Spring Boot
    await api.post(endpoint, payload);
  }
};