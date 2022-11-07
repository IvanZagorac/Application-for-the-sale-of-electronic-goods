export class ApiResponse{

    status:string;
    errorCode:number;
    messages:string|null;

    constructor(status:string,errorCode:number,messages:string|null=null) {
      this.status=status;
      this.errorCode=errorCode;
      this.messages=messages;
    }

}