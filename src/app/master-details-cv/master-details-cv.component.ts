import {Component, inject} from '@angular/core';
import {AsyncPipe, DatePipe, NgSwitchCase, UpperCasePipe} from "@angular/common";
import {AutocompleteComponent} from "../cv/autocomplete/autocomplete.component";
import {CvCardComponent} from "../cv/cv-card/cv-card.component";
import {EmbaucheComponent} from "../cv/embauche/embauche.component";
import {ListComponent} from "../cv/list/list.component";
import {CvService} from "../cv/services/cv.service";
import {catchError, Observable, of, shareReplay} from "rxjs";
import {Cv} from "../cv/model/cv";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-master-details-cv',
  standalone: true,
  imports: [
    AsyncPipe,
    AutocompleteComponent,
    CvCardComponent,
    DatePipe,
    EmbaucheComponent,
    ListComponent,
    NgSwitchCase,
    UpperCasePipe,
    RouterOutlet
  ],
  templateUrl: './master-details-cv.component.html',
  styleUrl: './master-details-cv.component.css'
})
export class MasterDetailsCvComponent {
  private cvService = inject(CvService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  cvs$: Observable<Cv[]>;
  selectedCv: Cv | null = null;

  constructor() {
    // Fetching the list of CVs
    this.cvs$ = this.cvService.getCvs().pipe(
      shareReplay(1),
      catchError((e) => {
        console.error('Error fetching CVs:', e);
        this.toastr.error(`
          Attention!! Les données sont fictives, problème avec le serveur.
          Veuillez contacter l'admin.`);
        return of(this.cvService.getFakeCvs());
      })
    );
    this.cvService.selectCv$.subscribe((cv) => {
      this.selectedCv = cv;
      // this.router.navigate([this.selectedCv.id], { relativeTo: this.activatedRoute });
      const newUrl = `/cv/list/${this.selectedCv.id}`;
      // Force the router to reload the component by navigating to the same route
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {this.router.navigate([newUrl]);});
    });
  }


}
