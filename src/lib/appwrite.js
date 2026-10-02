// src/lib/appwrite.js
import { Client, Account, TablesDB, ID, Query, Permission, Role } from 'appwrite'

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)

export const account = new Account(client)
export const tablesDB = new TablesDB(client)
export { ID, Query, Permission, Role }

export const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
export const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID