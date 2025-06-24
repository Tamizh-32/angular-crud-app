import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Iuser } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // API KEY
  private headers = {
    headers: new HttpHeaders({
      'x-api-key': 'reqres-free-v1'
    })
  };

  // API URL
  private apiUrl = 'https://reqres.in/api/users';

  constructor(private http: HttpClient) { }

  // Get All Users (GET)
  getUsers(page: number = 1): Observable<{ data: Iuser[], total_pages: number }> {
    return this.http.get(`${this.apiUrl}?page=${page}`, this.headers).pipe(
      map(response => response as { data: Iuser[], total_pages: number })
    );
  }

  // Get User
  getUser(id: number): Observable<{ data: Iuser }> {
    return this.http.get(`${this.apiUrl}/${id}`, this.headers).pipe(
      map(response => response as { data: Iuser })
    );
  }

  // Create User (POST)
  addUser(user: Iuser | FormData): Observable<Iuser> {
    return this.http.post(this.apiUrl, user, this.headers).pipe(
      map(response => response as Iuser)
    );
  }

  //  Update user (PUT)
  updateUser(id: number, user: Partial<Iuser> | FormData): Observable<Iuser> {
    return this.http.put(`${this.apiUrl}/${id}`, user, this.headers).pipe(
      map(response => response as Iuser)
    );
  }

  // Delete User (DELETE)
  deleteUser(id: number): Observable<void> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.headers).pipe(
      map(() => { })
    );
  }

}