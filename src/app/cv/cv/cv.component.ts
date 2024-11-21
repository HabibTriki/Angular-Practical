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
import {ActivatedRoute} from "@angular/router";

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
  private route = inject(ActivatedRoute);
  private cvService = inject(CvService);

  cvs$: Observable<Cv[]>;
  juniors$: Observable<Cv[]>;
  seniors$: Observable<Cv[]>;
  selectedCv: Observable<Cv> | null = null;
  date = new Date();

  activeTab: 'juniors' | 'seniors' = 'juniors';

  constructor() {
    const resolvedCvs = this.route.snapshot.data['cvs'] as Cv[];
    this.cvs$ = of(resolvedCvs);

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
