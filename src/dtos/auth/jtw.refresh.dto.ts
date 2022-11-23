export class JtwRefreshDto{
  role:"administrator"|"user";
  id:number;
  identity:string;
  ext:number;//Unix timestamp
  ip:string;
  ua:string;

  toPlainObject(){
    return{
      role:this.role,
      administratorId:this.id,
      identity:this.identity,
      ext:this.ext,
      ip:this.ip,
      ua:this.ua
    }
  }
}