export interface Review {
    id?: string; // Optional, as MongoDB generates it
    rating: number; // Between 1 and 5
    comment?: string; // Optional
    userId: string; // Reference to User
    propertyId: string; // Reference to Property
    createdAt?: Date;
    updatedAt?: Date;
  }
  