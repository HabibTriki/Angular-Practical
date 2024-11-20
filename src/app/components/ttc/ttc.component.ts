import {Component, computed, signal} from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-ttc',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './ttc.component.html',
  styleUrl: './ttc.component.css'
})
export class TtcComponent {
  quantite = signal(1);
  tva = signal(18);
  prix = signal(0)

  prixTTC = computed(
    () => {
      return (((+this.prix()) * (1 + (+this.tva()) / 100)) * (1 - this.discount())).toFixed(2);
    }
  )
  discount = computed(
    () => {
      const q = this.quantite();
      if (q > 15)
        return 0.3;
      else if(q >= 10)
        return (0.2);
      else
        return 0;
    }
  )
  discountOnTot = computed(
    () => {
      return ((+this.discount()) * (+this.prixTotTTC())).toFixed(2);
    }
  )
  prixTotTTC = computed(() => {
      return ((+this.prixTTC()) * (+this.quantite())).toFixed(2);
    }
  )
}

