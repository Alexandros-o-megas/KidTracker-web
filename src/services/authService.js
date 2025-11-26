import api from './api';

export const authService = {
  /**
   * Envia as credenciais para o backend.
   * O backend deve retornar: { token: "...", userDetails: { nome: "...", role: "..." } }
   */
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  /**
   * Obtém os dados do utilizador com base no token guardado.
   * O backend deve retornar os detalhes do utilizador autenticado.
   */
  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  async register(registerData) {
    // registerData deve ser um objeto com { nome, email, senha }
    const response = await api.post('/auth/register', registerData);
    return response.data;
  },

  async createMotorista(motoristaData) {
  // motoristaData = { nome, email, senha }
  // Esta chamada irá para o novo endpoint de admin, que é protegido.
  // O interceptor do axios já adiciona o token do admin ao cabeçalho.
  const response = await api.post('/admin/motoristas', motoristaData);
  return response.data;
}

};