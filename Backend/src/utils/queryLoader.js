import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Simulate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const QUERY_PATH = path.join(__dirname, '..', 'queries');

function loadQuery(fileName) {
  const fullPath = path.join(QUERY_PATH, fileName);
  return fs.readFileSync(fullPath, 'utf-8');
}

export default loadQuery;
