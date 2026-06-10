export type User = {
  id: string;
  email: string;
  passwordHash: string;
};

const users = new Map<string, User>();

export function getUserByEmail(email: string): User | undefined {
  return users.get(email);
}

export function addUser(user: User): void {
  users.set(user.email, user);
}

export function getAllUsers() {
  return Array.from(users.values());
}
