class apiResponse extends Error {
  constructor(statusCode , data,  message="sucess"){
    super(message);
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.sucess = statusCode >= 200 && statusCode < 300;
  }
}
export {apiResponse}
//status codeka use karke hum ye check kar sakte hai ki request successfull hai ya nahi inki values 200 se 300 ke beech me hoti hai