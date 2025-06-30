import oracledb from 'oracledb';

const dbConfig = {
  user: process.env.USER,
  password: process.env.PASSWORD,
  connectString: process.env.NAME,
};

async function connectDB() {
  return await oracledb.getConnection(dbConfig);
}

export default connectDB;
