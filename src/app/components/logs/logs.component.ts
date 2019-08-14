import { Component, OnInit } from '@angular/core';
import { Log } from 'src/app/models/log';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
  logs: Log[];

  selectedLog: Log;
  logsLoaded = false;
  selectedToDelete: Log = {id: null, text: null, date: null};

  constructor(private logService: LogService) {}

  ngOnInit() {
    this.logService.getLogs().subscribe({
      next: (returnedLogs: Log[]) => {
        this.logs = returnedLogs;
        this.logsLoaded = true;
      }
    });

    this.logService.onResetStateSource.subscribe({
      next: (val: boolean) => {
        if (val) {
          this.selectedLog = null;
        }
      }
    });
  }

  onSelect(log: Log) {
    this.selectedLog = log;
    this.logService.setFormLog(log);
  }

  onDelete(log: Log) {
    this.selectedToDelete = log;
  }

  onConfirmDelete() {
    this.logService.deleteLog(this.selectedToDelete);
    this.selectedToDelete = null;
  }
}
