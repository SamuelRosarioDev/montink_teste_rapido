export type Product = {
    id: number;
    name: string;
    price: string;
    images: string[];
    description: string;
    status: string;
    variants: {
        sizes: string[];
        colors: string[];
    };
};