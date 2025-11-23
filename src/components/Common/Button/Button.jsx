import React from 'react';
// Se não tiver o CSS global, pode remover o className
const Button = ({ children, onClick, icon }) => (
  <button className="btn btn-primary" onClick={onClick}>
    {icon}
    {children}
  </button>
);
export default Button;