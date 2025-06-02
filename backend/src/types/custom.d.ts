declare namespace Express {
  interface Request {
    user?: {
      id?: string;
      name: string;
      email: string;
      username: string;
      role: "admin" | "member";
    };
  }
}
