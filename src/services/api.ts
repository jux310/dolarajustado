import axios from 'axios';
import { ApiResponse, DolarBolsa, UVAData } from '../types';

const API_BASE_URL = 'https://api.argentinadatos.com/v1';

export const fetchDolarBolsa = async (): Promise<DolarBolsa[]> => {
  try {
    const response = await axios.get<ApiResponse<DolarBolsa>>(
      `${API_BASE_URL}/cotizaciones/dolares/bolsa`,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    if (!Array.isArray(response.data)) {
      throw new Error('Invalid dolar data received from API');
    }
    
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch dolar data: ${error.message}`);
    }
    throw new Error('An unexpected error occurred while fetching dolar data');
  }
};

export const fetchUVA = async (): Promise<UVAData[]> => {
  try {
    const response = await axios.get<ApiResponse<UVAData>>(
      `${API_BASE_URL}/finanzas/indices/uva`,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    if (!Array.isArray(response.data)) {
      throw new Error('Invalid UVA data received from API');
    }
    
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch UVA data: ${error.message}`);
    }
    throw new Error('An unexpected error occurred while fetching UVA data');
  }
};