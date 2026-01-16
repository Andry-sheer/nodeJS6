import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getUsers = async () => {
  try {
    const userPath = path.join(__dirname, '../static/users.json');
    const data = await readFile(userPath, 'utf-8');
    const users = JSON.parse(data);
    return users;
  } catch (error) {
    console.log('error read file!', error.message);
    return [];
  }
}