import React from 'react';
import { AdminMedia } from './AdminMedia';

export const AdminLogos = () => {
  return (
    <AdminMedia
      pageTitle="Logos & Brand Assets"
      pageDescription="Upload logo files only. Category and placement are locked for reliable logos-page rendering."
      defaultCategory="logos"
      defaultPlacement="logos-page"
      lockCategory
      lockPlacement
    />
  );
};
