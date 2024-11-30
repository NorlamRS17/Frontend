import React, { useEffect, useState } from 'react';
import { AxioCryptos } from '../services/cryptoService'; 

const CryptoTable = () => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'cmc_rank', direction: 'asc' });//Para ordenar por columna  

  const getCryptos = async () => {
    setLoading(true); 
    const data = await AxioCryptos();
    setCryptos(data);
    setLoading(false);
  };

  useEffect(() => {
    getCryptos(); 
  }, []); 

  const sortData = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedCryptos = [...cryptos].sort((a, b) => {
      const aValue = getNestedValue(a, key) || 0; 
      const bValue = getNestedValue(b, key) || 0; 

      if (typeof aValue === 'string') {
        return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
  

    return direction === 'asc' ? aValue - bValue : bValue - aValue;
    });

    setCryptos(sortedCryptos);
  };

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  if (loading) {
    return <div>Cargando Información...</div>;
  }

  return (
    <div>
      <h1>Lista de  las 100 criptomonedas con mayor capitalización de mercado</h1>
      <div className='button-container'>
      <button onClick={getCryptos}>Actualizar Lista</button>
      </div>
      
      <table>
        <thead>
          <tr>
            <th onClick={() => sortData('cmc_rank')}>#</th>
            <th onClick={() => sortData('name')}>Nombre</th>
            <th onClick={() => sortData('quote.USD.price')}>Precio</th>
            <th onClick={() => sortData('quote.USD.market_cap')}>Capitalización</th>
            <th onClick={() => sortData('max_supply')}>Suministro Máximo</th>
            <th onClick={() => sortData('circulating_supply')}>Suministro Circulante</th>
            <th onClick={() => sortData('quote.USD.percent_change_1h')}>1D (%)</th>
            <th onClick={() => sortData('quote.USD.percent_change_24h')}>30 (%)</th>
          </tr>
        </thead>
        <tbody>
          {cryptos.map(crypto => (
            <tr key={crypto.id}>
              <td>{crypto.cmc_rank}</td>
              <td>{crypto.name} ({crypto.symbol})</td>
              <td>${crypto.quote.USD.price.toFixed(2)}</td>
              <td>${crypto.quote.USD.market_cap.toLocaleString()}</td>
              <td>
                {crypto.max_supply ? 
                  crypto.max_supply.toLocaleString() + ' ' + crypto.symbol 
                  : 'N/A'}
              </td>
              <td>
                {crypto.circulating_supply ? 
                  crypto.circulating_supply.toLocaleString() + ' ' + crypto.symbol 
                  : 'N/A'}
              </td>
              <td>{crypto.quote.USD.percent_change_1h.toFixed(2)}%</td>
              <td>{crypto.quote.USD.percent_change_24h.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoTable; 