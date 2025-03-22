export interface Favorite {
    id?: string; // Optional, since MongoDB generates it
    userId: string; // User ID
    name: string;
    properties?: string[]; // Array of Property IDs
    createdAt?: Date;
    updatedAt?: Date;
  }
  