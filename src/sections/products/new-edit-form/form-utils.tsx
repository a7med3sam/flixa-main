import { toFormData } from 'axios';
import { ProductDetails } from 'src/types/products';

export interface FormUnit {
  originalId: string;
  id: string;
  UnitId: string;
  Price: number;
  ConversionRate: number;
}

export function convertIntoEditFormData(data: any, product: ProductDetails): FormData {
  const {
    Category,
    MainUnit,
    Images,
    ProductUnitOfMeasures: FormUnits,
    mainCategory: _,
    PriceInMainUnit,
    ...rest
  } = data;

  // Check for Images
  const removedImages = product.productImages
    .filter(({ url }) => !Images.includes(url))
    .map(({ id }) => id);
  const addedImages = Images.filter((img: File | string) => typeof img !== 'string') as File[];

  // check for Units
  const removedUnits = product.productUnitOfMeasures
    .filter(
      (oldUnit) =>
        oldUnit.unitOfMeasureId !== product.mainUnitId &&
        // check if the product has an ID doesn't exist in form object
        FormUnits.every((formUnit: FormUnit) => formUnit.originalId !== oldUnit.id)
    )
    .map(({ id }) => id);
  const addedUnits = FormUnits.filter(
    (formUnit: FormUnit) =>
      formUnit.UnitId !== product.mainUnitId &&
      product.productUnitOfMeasures.every(
        // check if the form has an ID doesn't exist in product object
        (oldUnit) => oldUnit.id !== formUnit.originalId
      )
  ).map(({ UnitId, Price, ConversionRate }: FormUnit) => ({
    unitId: UnitId,
    price: Price,
    conversionRate: ConversionRate,
  }));
  const editedUnits: Record<string, any>[] = FormUnits.filter((formUnit: FormUnit) =>
    // while the ID is the same, check if any other prop has been changed then return Form Object
    product.productUnitOfMeasures.some(
      (oldUnit) =>
        oldUnit.id === formUnit.originalId &&
        (oldUnit.unitOfMeasureId !== formUnit.UnitId ||
          oldUnit.price !== formUnit.Price ||
          oldUnit.conversionRate !== formUnit.ConversionRate)
    )
  ).map(({ originalId, UnitId, Price, ConversionRate }: FormUnit) => ({
    id: originalId,
    unitId: UnitId,
    price: Price,
    conversionRate: ConversionRate,
  }));

  const oldMainUnit = product?.productUnitOfMeasures.find((item) => {
    return item.unitOfMeasureId === product.mainUnitId;
  });
  if (
    oldMainUnit &&
    (oldMainUnit.unitOfMeasureId !== MainUnit.id || oldMainUnit.price !== PriceInMainUnit)
  ) {
    editedUnits.push({
      id: oldMainUnit.id,
      unitId: MainUnit.id || '',
      price: PriceInMainUnit,
      conversionRate: oldMainUnit.conversionRate,
    });
  }

  const dataBody = {
    ...rest,
    CategoryId: Category.id,
    ImagesRemove: removedImages,
    ProductUnitOfMeasuresRemove: removedUnits,
    ProductUnitOfMeasuresAdd: addedUnits,
    ProductUnitOfMeasuresUpdate: editedUnits,
  };
  const formData = new FormData();
  toFormData(dataBody, formData);

  if (addedImages.length) addedImages.forEach((image) => formData.append('ImagesNew', image));

  return formData;
}
