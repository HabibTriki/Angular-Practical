import { Injectable, computed, signal } from '@angular/core';
import { CredentialsDto } from '../dto/credentials.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { HttpClient } from '@angular/common/http';
import { API } from '../../../config/api.config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {
    this.loadUserState();
  }

  private userId = signal<number | null>(null);
  private isAuthenticated = computed(() => !!this.userId());


  login(credentials: CredentialsDto): Observable<LoginResponseDto> {
    return new Observable(observer => {
      this.http.post<LoginResponseDto>(API.login, credentials).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.id);
          localStorage.setItem('userid',response.userId.toString());
          this.userId.set(response.userId);

          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        },
      });
    });
  }


  private loadUserState() {
    const userid = localStorage.getItem('userid');
    if (userid) {
      this.userId.set(+userid);
    }
  }
  get isAuthenticatedSignal() {
    return this.isAuthenticated;
  }

  get userIdSignal() {
    return this.userId;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userid');
    this.userId.set(0);
  }
}
