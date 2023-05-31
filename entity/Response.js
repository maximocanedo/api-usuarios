"use strict";
class Response {
  constructor(obj) {
    let newObj = {
      ErrorFound: false,
      Message: "",
      Details: "",
      Exception: null,
      AffectedRows: 0,
      ObjectReturned: null,
      ...obj,
    };
    this.ErrorFound = newObj.ErrorFound;
    this.Message = newObj.Message;
    this.Details = newObj.Details;
    this.Exception = newObj.Exception;
    this.AffectedRows = newObj.AffectedRows;
    this.ObjectReturned = newObj.ObjectReturned;
  }
}
module.exports = Response;
