import { useContext } from 'react';
import { MineDataContext } from './MineDataContext';

export const useMineData = () => {
  const context = useContext(MineDataContext);
  if (!context) {
    throw new Error('useMineData must be used within a MineDataProvider');
  }
  return context;
};
