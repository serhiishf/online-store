//========
interface Product {
  id: number,
  title: string,
  description: string,
  price: number,
  discountPercentage: number,
  rating: number,
  stock: number,
  brand: string,
  category: string,
  thumbnail: string,
  images:Array<string>
}
//========

export class Products {
  public draw (data: Product[] | []): void {
    const fragment = <DocumentFragment>document.createDocumentFragment();
  }
}