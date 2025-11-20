import React from 'react';
import './DataTable.css';

const DataTable = ({ columns, data, loading, emptyMessage }) => {
  if (loading) {
    return (
      <div className="data-table loading">
        <div className="loading-spinner">A carregar...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="data-table empty">
        <div className="empty-message">{emptyMessage || 'Nenhum dado encontrado'}</div>
      </div>
    );
  }

  return (
    <div className="data-table">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.id || index}>
              {columns.map((column) => (
                <td key={column.key}>
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;