// src/app/models/jwt-payload.interface.ts
import { JwtPayload } from 'jwt-decode';
import { Roles } from './roles.interface';

export interface MyJwtPayload extends JwtPayload {
  roles?: Roles[]; 
}
