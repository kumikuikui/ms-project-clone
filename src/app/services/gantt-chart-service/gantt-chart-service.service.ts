import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Activity, activity } from 'src/app/model/ganttChart';

@Injectable({
  providedIn: 'root',
})
export class GanttChartServiceService {
  constructor(private http: HttpClient) { }

  // get request
  getGanttData(id: string): Observable<Activity[]> {
    of(activity);
    return of(activity);
  }
}
