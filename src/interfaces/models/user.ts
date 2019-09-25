export interface IUser {
  id?: number;
  firstName: string;
  lastName?: string;
  email: string;
  password?: string;
  roles: enRoles[];

  createdDate?: Date;
  updatedDate?: Date;
}

export enum enRoles {
  sysAdmin = 'sysAdmin',
  admin = 'admin',
  user = 'user'
}

export interface IOrder {
  id?: number;
  description: string;
  quantity: number;
  value: number;

  createdDate?: Date;
  createdDate?: Date;
}
