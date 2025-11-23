import React from 'react';
const VeiculoForm = ({ onSubmit, onCancel }) => (
  <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
    <p>Formulário para adicionar/editar veículo.</p>
    <button type="submit">Salvar</button>
    <button type="button" onClick={onCancel}>Cancelar</button>
  </form>
);
export default VeiculoForm;