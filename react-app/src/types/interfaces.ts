export interface Inventory {
    id: number;
    branch: Branch;
    media: Media;
    status: string;
    renewalCount: number;
}

export interface User {
    id: number;
    email: string;
    name: string;
    role: string;
    address: string;
}

export interface MediaCirculation {
    id: number;
    borrowDate: Date;
    dueDate: Date;
    returnDate: Date;
    returned: boolean;
    inventory: Inventory;
    user: User;
}

export interface Media {
    id: number;
    title: string;
    author: string;
    genre: string;
    format: string;
    publicationYear: number;
}

export interface Branch {
    id: number;
    name: string;
    address: string;
    city: string;
}