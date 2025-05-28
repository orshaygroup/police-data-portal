import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { MapDataProvider } from '@/hooks/useMapDataContext';

createRoot(document.getElementById("root")!).render(
  <MapDataProvider>
    <App />
  </MapDataProvider>
);
