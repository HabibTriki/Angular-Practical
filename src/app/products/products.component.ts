import { Component } from "@angular/core";
import {
  BehaviorSubject,
  Observable,
  concatMap,
  map,
  takeWhile,
  scan,
} from "rxjs";
import { Product } from "./dto/product.dto";
import { ProductService } from "./services/product.service";
import { Settings } from "./dto/product-settings.dto";
import { AsyncPipe, CommonModule } from "@angular/common";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
  standalone: true,
  imports: [AsyncPipe,CommonModule],
})
export class ProductsComponent {
  products$!: Observable<Product[]>;

  private loadMore$ = new BehaviorSubject<void>(undefined);
  private limit = 12;
  private skip = 0;
  hasMoreProducts = true;

  constructor(private productService: ProductService) {
    this.products$ = this.loadMore$.pipe(
      takeWhile(() => this.hasMoreProducts),
      concatMap(() => this.fetchProducts()),
      scan((allProducts, newProducts) => [...allProducts, ...newProducts], [] as Product[])
    );
  }

  fetchProducts(): Observable<Product[]> {
    const settings: Settings = { limit: this.limit, skip: this.skip };
    return this.productService.getProducts(settings).pipe(
      map(response => {
        if (this.skip + this.limit >= response.total) {
          this.hasMoreProducts = false;
        }
        this.skip += this.limit; 
        return response.products; 
      })
    );
  }

  loadMore() {
    this.loadMore$.next();
  }

  trackByProduct(index: number, product: Product): number {
    return product.id;
  }
}
