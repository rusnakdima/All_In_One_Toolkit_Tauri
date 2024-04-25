/* system libraries */
// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { invoke } from "@tauri-apps/api/tauri";
// import { Observable, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(
    // private http: HttpClient
  ) { }

  updateLibrary() {
    return invoke("update_library");
  }

  // getImage(imageUrl: string): any {
  //   return this.http.get<any>(imageUrl);
  // }
}
