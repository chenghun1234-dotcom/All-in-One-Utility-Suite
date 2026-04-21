import fs from 'fs';
import path from 'path';

// Define the database path
const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

// Ensure the data directory exists
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'));
}

// Initialize the database file if it doesn't exist
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], links: [] }, null, 2));
}

export interface User {
  id: string;
  email: string;
  password?: string;
  tier: 'Basic' | 'Pro' | 'Enterprise';
  credits: number;
  createdAt: string;
}

export interface Link {
  id: string;
  shortId: string;
  originalUrl: string;
  userId: string;
  clicks: number;
  createdAt: string;
  type: 'static' | 'dynamic';
  // Security features
  password?: string;
  expiresAt?: string;
  maxClicks?: number;
}

export class DB {
  private static read() {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  }

  private static write(data: any) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  }

  // User Management
  static getUsers(): User[] {
    return this.read().users;
  }

  static findUserByEmail(email: string): User | undefined {
    return this.getUsers().find(u => u.email === email.toLowerCase());
  }

  static createUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const data = this.read();
    const newUser: User = {
      ...user,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
      email: user.email.toLowerCase()
    };
    data.users.push(newUser);
    this.write(data);
    return newUser;
  }

  static updateUserTier(email: string, tier: User['tier']): boolean {
    const data = this.read();
    const userIndex = data.users.findIndex((u: User) => u.email === email.toLowerCase());
    if (userIndex === -1) return false;
    
    data.users[userIndex].tier = tier;
    data.users[userIndex].credits = tier === 'Pro' ? 1000 : (tier === 'Enterprise' ? 10000 : 10);
    this.write(data);
    return true;
  }

  // Link Management
  static getLinks(): Link[] {
    return this.read().links || [];
  }

  static findLinkByShortId(shortId: string): Link | undefined {
    return this.getLinks().find(l => l.shortId === shortId);
  }

  static findLinksByUserId(userId: string): Link[] {
    return this.getLinks().filter(l => l.userId === userId);
  }

  static createLink(link: Omit<Link, 'id' | 'clicks' | 'createdAt'>): Link {
    const data = this.read();
    if (!data.links) data.links = [];
    
    const newLink: Link = {
      ...link,
      id: Math.random().toString(36).substring(7),
      clicks: 0,
      createdAt: new Date().toISOString()
    };
    data.links.push(newLink);
    this.write(data);
    return newLink;
  }

  static updateLink(id: string, updates: Partial<Link>): boolean {
    const data = this.read();
    const index = data.links.findIndex((l: Link) => l.id === id);
    if (index === -1) return false;

    data.links[index] = { ...data.links[index], ...updates };
    this.write(data);
    return true;
  }

  static incrementClick(shortId: string): boolean {
    const data = this.read();
    const index = data.links.findIndex((l: Link) => l.shortId === shortId);
    if (index === -1) return false;

    data.links[index].clicks += 1;
    this.write(data);
    return true;
  }
}
