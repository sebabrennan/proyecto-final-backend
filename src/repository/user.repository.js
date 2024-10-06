import UserDaoMongo from '../daos/user.dao.js';
import UserDTO from '../dto/user.dto.js';
const userDao = new UserDaoMongo();

export default class UserRepository {
    constructor(){
        this.dao = userDao;
    }

    async getUserById(id) {
        try {
          const user = await this.dao.getUserById(id);
          return new UserDTO(user);
        } catch (error) {
          throw new Error(error);
        }
    };

    async getAllUsers() {
      try {
        const users = await this.dao.getAll();
        const usersDTO = users.map(user => new UserDTO(user));
        return usersDTO
      } catch (error) {
        throw new Error(error);
      }
    }
}