"use strict";
const sql = require("mssql");
const Response = require("./../entity/Response");

class Connection {
  static get Database() {
    return {
      Neptuno: "Neptuno",
      Libreria: "Libreria",
      Viajes: "Viajes",
      BDSucursales: "BDSucursales",
    };
  }
  constructor(databaseName) {
    this.Server = "localhost\\SQLEXPRESS";
    this.IntegratedSecurity = true;
    this.DataBaseName = databaseName;
    this.Response = new Response();
  }
  async OpenConnection(databaseName) {
    try {
      const config = {
        user: "",
        password: "",
        server: this.ServerName,
        database: databaseName,
        options: {
          encrypt: true, // If you are connecting to a SQL Server instance on Azure, you need this
        },
      };
      const pool = await sql.connect(config);
      return pool;
    } catch (err) {
      this.Response.ErrorFound = true;
      this.Response.Message = "Error al conectar al servidor";
      this.Response.Details = err.message;
      this.Response.Exception = err;
      return null;
    }
  }
  async FetchData(query, parameters = null) {
    try {
      const pool = await this.OpenConnection(this.DatabaseName);
      const request = pool.request();

      if (parameters !== null) {
        Object.entries(parameters).forEach(([key, value]) => {
          request.input(key, value);
        });
      }

      const result = await request.query(query);
      return new Response({ ObjectReturned: result.recordset });
    } catch (ex) {
      return new Response({
        ErrorFound: true,
        Message: "Error al obtener datos de la base de datos.",
        Details: ex.toString(),
        Exception: ex,
      });
    }
  }
  async RunTransaction(query, parameters = null) {
    try {
      const pool = await this.OpenConnection(this.DatabaseName);
      const transaction = new sql.Transaction(pool);
      const request = new sql.Request(transaction);

      if (parameters !== null) {
        Object.entries(parameters).forEach(([key, value]) => {
          request.input(key, value);
        });
      }

      await transaction.begin();
      const result = await request.query(query);
      await transaction.commit();

      return new Response({ AffectedRows: result.rowsAffected[0] });
    } catch (ex) {
      return new Response({
        ErrorFound: true,
        Message: "Error al realizar la transacción en la base de datos.",
        Details: ex.toString(),
        Exception: ex,
        AffectedRows: 0,
      });
    }
  }
}
module.exports = Connection;
