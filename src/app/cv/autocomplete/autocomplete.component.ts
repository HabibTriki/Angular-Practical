import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, of, switchMap, debounceTime, distinctUntilChanged, filter, catchError } from 'rxjs';
import { CvService } from '../services/cv.service';
import { Cv } from '../model/cv';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DefaultImagePipe } from "../pipes/default-image.pipe";


@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css'],
  standalone: true,
  imports: [DefaultImagePipe,ReactiveFormsModule, CommonModule]
})
export class AutocompleteComponent {
  private cvService = inject(CvService);
  private router = inject(Router);

  searchControl = new FormControl('');
  filteredCvs$: Observable<Cv[]> = of([]);

  constructor() {
    this.filteredCvs$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter((value): value is string => typeof value === 'string' && value.length > 0),
      switchMap(value => this.searchCvs(value)),
      catchError(err => {
        console.error(err);
        return of([]);
      })
    );
  }

  searchCvs(query: string): Observable<Cv[]> {
    const filter = {
      where: {
        name: {
          like: `%${query}%`
        }
      }
    };
    const filterString = JSON.stringify(filter);
    return this.cvService.getCvs(filterString);
  }


  onSelectCv(cv: Cv) {
    this.router.navigate(['/cv', cv.id]);
  }
}
