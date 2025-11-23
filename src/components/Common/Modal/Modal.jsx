import React from 'react';
// Idealmente, adicionar CSS para o modal
const Modal = ({ children, isOpen, onClose, title }) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100 }}>
      <div style={{ background: 'white', margin: '5% auto', padding: '20px', borderRadius: '8px', maxWidth: '500px' }}>
        <h2>{title}</h2>
        {children}
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
};
export default Modal;