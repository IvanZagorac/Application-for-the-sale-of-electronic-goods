export class LoginInfoDto {
  id:number;
  identity:string;
  token:string;

  constructor(id:number,uname:string,jwt:string){
    this.id=id;
    this.identity=uname;
    this.token=jwt;
  }
}