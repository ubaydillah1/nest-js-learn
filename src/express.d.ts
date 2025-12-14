import { ROLE } from '@prisma/client';

declare global {
  namespace Express {
    interface User {
      id: string;
      role: ROLE;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};
