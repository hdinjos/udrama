import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEYS } from '../decorators/roles.decorator';
import { Role } from '../enums/roles.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLE_KEYS, [
      context.getHandler(),
      context.getClass(),
    ]);

    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!requiredRoles) return true;
    if (user && requiredRoles.includes(user['role_name'])) return true;

    return false;
  }
}
