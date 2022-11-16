import { SetMetadata } from "@nestjs/common";

export const AllowToRolesDescriptor=(...roles:("administrator"|"user")[])=>{
  return SetMetadata('allow_to_roles',roles);
}