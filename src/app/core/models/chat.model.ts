import { Message } from './message.model';

export interface Chat {
  id?: string; // Optional, since MongoDB generates it
  participants: string[]; // Array of User IDs
  propertyId: string; // Property ID
  messages: Message[];
  lastMessage?: Message;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
