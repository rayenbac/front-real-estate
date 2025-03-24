import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Property } from '../models/property.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = `${environment.apiBaseUrl}/properties`; // Replace with your API base URL

  constructor(private http: HttpClient) {}

  // Get all properties
  getProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(this.apiUrl);
  }

  // Get a single property by ID
  getProperty(id: string): Observable<Property> {
    return this.http.get<Property>(`${this.apiUrl}/${id}`);
  }

  
// Add a new property (send form-data)
addProperty(formData: FormData): Observable<Property> {
  return this.http.post<Property>(this.apiUrl, formData);
}

// Update a property (send form-data)
updateProperty(id: string, formData: FormData): Observable<Property> {
  return this.http.put<Property>(`${this.apiUrl}/${id}`, formData);
}


  // Delete a property
  deleteProperty(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}