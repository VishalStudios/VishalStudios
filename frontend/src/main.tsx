import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

console.log('--- App Initializing ---');

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  console.log('--- App Rendered Successfully ---');
} else {
  console.error('ERROR: Could not find "root" element in index.html');
}
