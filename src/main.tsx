import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import loadFileToConsole from '../scripts/loadFileToConsole.js';
import readCsvString from '../scripts/readCsvString.js';
import smoothData from '../scripts/smoothData.js';
import {sumByYear, countByYear} from '../scripts/sumByYear.js';

// Attach readFile to window
(window as any).scripts = {
  loadFileToConsole: loadFileToConsole,
  readCsvString: readCsvString,
  smoothData: smoothData,
  sumByYear: sumByYear,
  countByYear: countByYear,
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
