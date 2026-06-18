import { create } from 'zustand';
import { Unit } from 'src/types/units';
import { Category } from 'src/types/categories';
import { ProductDetails } from 'src/types/products';

interface FormData {
  product?: ProductDetails;
  categories: Category[];
  subCategories: Category[];
  units: Unit[];
  labels: Record<string, string>;
}

interface ProductFormStore extends FormData {
  setAll: (all: FormData) => void;
  setSubCategories: (subCategories: Category[]) => void;
}

export const useFormStore = create<ProductFormStore>((set) => {
  return {
    product: undefined,
    categories: [],
    subCategories: [],
    setSubCategories: (subCategories) => set({ subCategories }),
    units: [],
    labels: {},
    setAll: (all) => {
      set(all);
    },
  };
});
