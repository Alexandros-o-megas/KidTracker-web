import React from 'react';

const Configuracoes = () => {
    return (
        <div className="page-container">
            <h1>Configurações Gerais</h1>
             <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', maxWidth: '600px' }}>
                <form>
                    <div className="form-group">
                        <label>Nome da Escola</label>
                        <input type="text" defaultValue="Escola Primária O Sucesso" />
                    </div>
                    <div className="form-group">
                        <label>Limite de Velocidade para Alertas (km/h)</label>
                        <input type="number" defaultValue="80" />
                    </div>
                    <Button>Salvar Configurações</Button>
                </form>
                <p style={{ marginTop: '1rem', color: '#64748b' }}><strong>(Funcionalidade em construção)</strong></p>
             </div>
        </div>
    );
};

export default Configuracoes;