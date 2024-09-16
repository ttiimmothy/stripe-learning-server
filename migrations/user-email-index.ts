import {Db} from "mongodb";


export default {
  async up(db: Db) {
    await db.collection('users').createIndex({ email: 1, username: 1, password: 1 }, { unique: true });
  },
};