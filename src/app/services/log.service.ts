import { Injectable } from '@angular/core';
import { Log } from '../models/log';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  logs: Log[] = [];

  private logSource = new BehaviorSubject<Log>({
    id: null,
    text: null,
    date: null
  });

  selectedLod = this.logSource.asObservable();

  private resetStateSource = new BehaviorSubject<boolean>(true);

  onResetStateSource = this.resetStateSource.asObservable();

  constructor() {}

  getLogs(): Observable<Log[]> {
    if (
      localStorage.getItem('todos')!==null &&
      localStorage.getItem('todos').length > 2
    ) {
      console.log(localStorage.getItem('todos').length);
      this.logs = JSON.parse(localStorage.getItem('todos'));
    } else {
      this.logs = [
        {
          id: '1',
          text: 'Walk a dog',
          date: new Date('7/23/2019 17:45:00')
        },
        {
          id: '2',
          text: 'Buy Milk',
          date: new Date('08/11/2019 17:45:00')
        },
        {
          id: '3',
          text: 'Do dishes',
          date: new Date('08/05/2019 19:37:00')
        }
      ];
    }

    this.sortLogsByDate();

    return of(this.logs);
  }

  setFormLog(log: Log) {
    this.logSource.next(log);
  }

  addLog(log: Log) {
    this.logs.unshift(log);
    this.sortLogsByDate();
    this.refreshLocalStorage();
  }

  updateLog(logPassed: Log) {
    this.logs.forEach(log => {
      if (log.id === logPassed.id) {
        log.text = logPassed.text;
        log.date = Date.now();
        this.sortLogsByDate();
      }
    });

    this.refreshLocalStorage();
  }

  deleteLog(logToDelete: Log) {
    const indexToDelete = this.logs.indexOf(logToDelete);
    this.logs.splice(indexToDelete, 1);
    this.refreshLocalStorage();
  }

  refreshLocalStorage() {
    const logJSON = JSON.stringify(this.logs);
    localStorage.setItem('todos', logJSON);
  }

  resetState() {
    this.resetStateSource.next(true);
  }

  // !HELPERS

  // From newest to oldest
  SortLogic(el1: Log, el2: Log): number {
    if (el1.date > el2.date) {
      return -1;
    }
    if (el1.date < el2.date) {
      return 1;
    }
    return;
  }

  sortLogsByDate() {
    this.logs.sort(this.SortLogic);
  }
}
