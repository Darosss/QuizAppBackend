import { SetMetadata } from '@nestjs/common';
import { RolesType } from 'src/users';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RolesType[]) => SetMetadata(ROLES_KEY, roles);

export const RolesAdminGuard = () => Roles(RolesType.Admin);
export const RolesSuperAdminGuard = () => Roles(RolesType.SuperAdmin);

export const RolesAdminSuperAdminGuard = () =>
  Roles(RolesType.Admin, RolesType.SuperAdmin);
