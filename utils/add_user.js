import path from 'path';
import { writeFile} from 'fs/promises';
import { fileURLToPath } from 'url';
import { getUsers } from './get_users.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const addUser = async (newUser) => {
  try {
    const filePath = path.join(__dirname, '../static/users.json')
    const users = await getUsers();
    const twinsUsers = users.find(user => user.email === newUser.email && user.username === newUser.username);

    if (twinsUsers) {
      throw new Error('user already added...');
    } else {
      const newUserArray = [...users, newUser]
      await writeFile(filePath, JSON.stringify(newUserArray, null, 2), 'utf-8')
    }
  }

  catch (error) {
    console.log('error add new user!', error);
    throw new Error;
  }
}