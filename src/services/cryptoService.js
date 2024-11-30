import axios from 'axios'

const API_URL = 'http://localhost:5000/cryptos';

export const AxioCryptos = async () => {
  try {
    const response = await axios.get(API_URL); //LLAMA AL SERVIDOR BACKEND "crypto-backend"
    return response.data; 
  } catch (error) {
    console.error('Error fetching cryptocurrencies:', error);
    return []; 
  }
};