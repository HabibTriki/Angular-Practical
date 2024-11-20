import { Component, inject } from "@angular/core";
import { Cv } from "../model/cv";
import { LoggerService } from "../../services/logger.service";
import { ToastrService } from "ngx-toastr";
import { CvService } from "../services/cv.service";
import { catchError, Observable, of, map, shareReplay } from "rxjs";
import { ListComponent } from "../list/list.component";
import { CvCardComponent } from "../cv-card/cv-card.component";
import { AsyncPipe, DatePipe, UpperCasePipe, CommonModule } from "@angular/common";
import { EmbaucheComponent } from "../embauche/embauche.component";
import { AutocompleteComponent } from "../autocomplete/autocomplete.component";

@Component({
  selector: "app-cv",
  templateUrl: "./cv.component.html",
  styleUrls: ["./cv.component.css"],
  imports: [
    AutocompleteComponent,
    CommonModule,
    ListComponent,
    CvCardComponent,
    DatePipe,
    AsyncPipe,
    UpperCasePipe,
    EmbaucheComponent
  ],
  standalone: true
})
export class CvComponent {
  private logger = inject(LoggerService);
  private toastr = inject(ToastrService);
  private cvService = inject(CvService);

  cvs$: Observable<Cv[]>;
  juniors$: Observable<Cv[]>;
  seniors$: Observable<Cv[]>;
  selectedCv: Observable<Cv> | null = null;
  date = new Date();

  activeTab: 'juniors' | 'seniors' = 'juniors';

  constructor() {
    this.cvs$ = this.cvService.getCvs().pipe(
      shareReplay(1),
      catchError((e) => {
        console.log('We are in error');
        this.toastr.error(`
          Attention!! Les données sont fictives, problème avec le serveur.
          Veuillez contacter l'admin.`);
        return of(this.cvService.getFakeCvs());
      })
    );

    this.juniors$ = this.cvs$.pipe(
      map(cvs => cvs.filter(cv => cv.age < 40))
    );

    this.seniors$ = this.cvs$.pipe(
      map(cvs => cvs.filter(cv => cv.age >= 40))
    );

    this.toastr.info("Bienvenue dans notre CvTech");
    this.selectedCv = this.cvService.selectCv$;
  }

  setActiveTab(tab: 'juniors' | 'seniors') {
    this.activeTab = tab;
  }
}
