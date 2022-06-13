import { Connection, createConnection, getConnectionOptions } from 'typeorm';

export default async (db: string) => {

  const connectionOptions = await getConnectionOptions(db)

  return createConnection(connectionOptions)
}
