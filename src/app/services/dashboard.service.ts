/* system libraries */
import { Injectable } from '@angular/core';
import { invoke } from "@tauri-apps/api/tauri";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor() { }

  updateLibrary() {
    return invoke("update_library");
  }
}
