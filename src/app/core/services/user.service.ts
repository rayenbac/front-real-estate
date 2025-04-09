import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiBaseUrl}/users`; // Replace with your API base URL

  constructor(private http: HttpClient) {}

  // Get all users
  getUsers(): Observable<User[]> {
    console.log('Fetching users from API...');
    return this.http.get<User[]>(this.apiUrl);
  }

  // Get a single user by ID
  getUser(id: string): Observable<User> {
    console.log(`Fetching user with ID: ${id}`);
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // Add a new user
  addUser(user: User): Observable<User> {
    console.log('Adding new user:', user);
    return this.http.post<User>(this.apiUrl, user, this.getHttpOptions());
  }

  // Update a user
  updateUser(id: string, user: User): Observable<User> {
    console.log(`Updating user with ID: ${id}`, user);
    return this.http.put<User>(`${this.apiUrl}/${id}`, user, this.getHttpOptions());
  }

  // Delete a user
  deleteUser(id: string): Observable<void> {
    console.log(`Deleting user with ID: ${id}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Helper method to get common HTTP options, such as authorization headers
  private getHttpOptions() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    // Add authorization header if needed
    // headers.set('Authorization', `Bearer ${yourToken}`);
    return { headers };
  }
}
