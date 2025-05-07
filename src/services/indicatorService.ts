import axios from 'axios';
import type { Indicator, IndicatorCode, IndicatorDetail } from '../types';

const API_URL = 'https://mindicador.cl/api';

export const getIndicators = async (): Promise<Record<string, Indicator>> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching indicators:', error);
    throw error;
  }
};

export const getIndicatorHistory = async (
  code: IndicatorCode, 
  year?: number
): Promise<IndicatorDetail> => {
  try {
    const url = year 
      ? `${API_URL}/${code}/${year}` 
      : `${API_URL}/${code}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching indicator ${code}:`, error);
    throw error;
  }
};

export const getIndicatorByDate = async (
  code: IndicatorCode, 
  date: string
): Promise<IndicatorDetail> => {
  try {
    const url = `${API_URL}/${code}/${date}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching indicator ${code} for date ${date}:`, error);
    throw error;
  }
}; 