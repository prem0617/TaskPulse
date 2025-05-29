declare namespace Express {
  interface Request {
    user?: {
      name: string;
      email: string;
      role: "admin" | "member";
    };
  }
}
