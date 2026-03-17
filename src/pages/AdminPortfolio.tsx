import React from 'react';
import { AdminMedia } from './AdminMedia';
import { MEDIA_PLACEMENT_VALUES } from '../constants/mediaPlacements';

export const AdminPortfolio = () => {
  return (
    <AdminMedia
      pageTitle="Portfolio Asset Manager"
      pageDescription="Upload portfolio images with locked mapping to the portfolio grid for predictable rendering."
      defaultCategory="portfolio"
      defaultPlacement={MEDIA_PLACEMENT_VALUES.PORTFOLIO_GRID}
      lockCategory
      lockPlacement
    />
  );
};
