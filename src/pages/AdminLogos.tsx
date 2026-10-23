import React from 'react';
import { AdminMedia } from './AdminMedia';
import { MEDIA_CATEGORY_VALUES, MEDIA_PLACEMENT_VALUES } from '../constants/mediaPlacements';

export const AdminLogos = () => {
  return (
    <AdminMedia
      pageTitle="Logos & Brand Assets"
      pageDescription="Upload logo files only. Category and placement are locked for reliable logos-page rendering."
      defaultCategory={MEDIA_CATEGORY_VALUES.LOGOS}
      defaultPlacement={MEDIA_PLACEMENT_VALUES.LOGOS_PAGE}
      lockCategory
      lockPlacement
    />
  );
};
