import React from 'react';
import { createRoot } from 'react-dom/client';
import ClassDiaryApp from './webclass';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ClassDiaryApp />
    </React.StrictMode>
  );
}
