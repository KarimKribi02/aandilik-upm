import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../users/entities/user.entity';

interface RequestUser {
  userId: number;
  email: string;
  role: UserRole;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest<{ user: RequestUser }>();
    const { user } = request;

    if (!user || !user.role) {
      return false;
    }

    // Normalize user roles for comparison
    const userRoleRaw = user.role;
    const userRoles = (Array.isArray(userRoleRaw) ? userRoleRaw : [userRoleRaw])
      .map(r => String(r).toLowerCase().trim());

    // Normalize required roles
    const normalizedRequired = requiredRoles.map(r => String(r).toLowerCase().trim());

    // Basic role mapping to bridge possible English/French mismatches
    const hasMatch = normalizedRequired.some((role) => {
      if (userRoles.includes(role)) return true;
      
      // Explicit mappings for Owner/Propriétaire
      if (role === 'propriétaire' && (userRoles.includes('owner') || userRoles.includes('proprietaire'))) return true;
      if (role === 'administrateur' && (userRoles.includes('admin') || userRoles.includes('administrator'))) return true;
      
      return false;
    });

    return hasMatch;
  }
}
