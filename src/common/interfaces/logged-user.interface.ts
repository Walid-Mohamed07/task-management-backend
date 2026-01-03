import { Role } from '../enums/role.enum';

export interface LoggedUser {
  sub: string;
  email: string;
  name: string;
  role: Role;
}
