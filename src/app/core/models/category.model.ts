export interface Category {
    _id: string; // MongoDB ID
    name: string;
    description: string;
    properties: string[]; // Array of Property IDs (referencing Property model)
    createdAt: Date;
    updatedAt: Date;
}