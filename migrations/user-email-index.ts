import {Db} from "mongodb";


export default {
  async up(db: Db) {
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
  },
  async down(db: Db) {
  await db.collection('users').dropIndex('email_1');
},
};