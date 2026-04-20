export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  userName: string;
  username?: string; // For backward compatibility with existing code
  password: string;
}
