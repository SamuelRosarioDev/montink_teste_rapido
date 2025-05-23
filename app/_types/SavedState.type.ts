import { Address } from './Address.type';
export type SavedState = {
  selectedSize: string | null;
  selectedColor: string | null;
  cep: string;
  frete: string | null;
  freteValor: number;
  address: Address | null;
};
