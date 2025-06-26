import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<string>(ROLE_KEY, context.getHandler());
    if (!requiredRole) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!user || user.role !== requiredRole) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
