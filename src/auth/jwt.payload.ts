export interface JwtPayload {
  id: number;
  username: string;
  roles: string[];
  iat?: number;
  exp?: number;
}
