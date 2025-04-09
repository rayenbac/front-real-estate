export interface Post {
    _id: string; // Optional, since MongoDB generates it
    title: string;
    description: string;
    author: string; // Reference to User
    likes: number;
    published: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }
  