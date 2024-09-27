export interface RoleBase {
  name: string;
}

export interface RoleCreate extends RoleBase {}

export interface Role extends RoleBase {
  id: number;
  store_id: number;
  created_at: Date;
  updated_at: Date;
}