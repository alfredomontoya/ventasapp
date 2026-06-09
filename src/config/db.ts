export type DbType = 'sqlite' | 'firebase' | 'mongodb';

const dbConfig: { dbType: DbType } = {
  dbType: 'sqlite',
};

export default dbConfig;
