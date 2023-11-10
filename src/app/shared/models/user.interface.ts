export interface User {
  email: string;
  id: string;
  roles: Role[];
}

export interface Role {
  Id: number;
  Description: string;
  permissions: RolePermission[];
}
export interface RolePermission {
  Id: number;
  Description: string;
}
