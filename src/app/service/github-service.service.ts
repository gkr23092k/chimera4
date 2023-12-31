import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GithubServiceService {
  private apiUrl = 'https://api.github.com';
  private owner = 'gkr23092k';
  private repo = 'report';
  private filePath = 'edataanal.txt';
  private newkey = 'ghp_'
  private newkey2 = 'L3ClJ9c'
  private token = this.newkey + 'MrOmLHjF2aPS3IGfQLx1k6MO0Ts3s' + this.newkey2;
  invokeFirstComponentFunction = new EventEmitter();
  subsVar!: Subscription;
  public messagesource: any = new BehaviorSubject('');
  currentvalue = this.messagesource.asObservable();

  changemessage(message: any) {
    this.messagesource.next(message)
  }

  constructor(private http: HttpClient) { }
  onFirstComponentButtonClick() {
    this.invokeFirstComponentFunction.emit();
    this.subsVar == undefined

  }

  fetchDataFromGitHub(): Observable<any> {
    const url = `${this.apiUrl}/repos/${this.owner}/${this.repo}/contents/${this.filePath}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.get(url, { headers }).pipe(
      catchError(error => {
        return throwError('Error fetching data from GitHub: ' + error.message);
      })
    );
  }

  appendDataToGitHub(data: string, sha: string): Observable<any> {
    const url = `${this.apiUrl}/repos/${this.owner}/${this.repo}/contents/${this.filePath}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    const content = btoa(data + '\n'); // Encode content to base64
    const message = 'Append data';
    const body = { message, content, sha };

    return this.fetchDataFromGitHub().pipe(
      switchMap(response => {
        return this.http.put(url, body, { headers }).pipe(
          catchError(error => {
            return throwError('Error appending data to GitHub: ' + error.message);
          })
        );
      })
    );
  }
}
