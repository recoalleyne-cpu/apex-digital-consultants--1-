import React from 'react';
import { AdminMedia } from './AdminMedia';

export const AdminPortfolio = () => {
  return (
    <AdminMedia
      pageTitle="Portfolio Asset Manager"
      pageDescription="Upload portfolio images with locked mapping to the portfolio grid for predictable rendering."
      defaultCategory="portfolio"
      defaultPlacement="portfolio-grid"
      lockCategory
      lockPlacement
    />
  );
};
