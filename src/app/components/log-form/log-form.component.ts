import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LogService } from 'src/app/services/log.service';
import { Log } from 'src/app/models/log';

@Component({
  selector: 'app-log-form',
  templateUrl: './log-form.component.html',
  styleUrls: ['./log-form.component.css']
})
export class LogFormComponent implements OnInit {
  log: Log = { id: null, text: null, date: null };

  @ViewChild('todoForm', { static: false }) form;
  isNew = true;

  constructor(private logService: LogService) {}

  ngOnInit() {
    // Subscribe to selected  log observable

    this.logService.selectedLod.subscribe({
      next: (logFrom: Log) => {
        if (logFrom.id !== null) {
          this.isNew = false;
          Object.assign(this.log, logFrom);
        }
      }
    });
  }

  onSubmit({ form: { value } }) {
    if (this.isNew) {
      this.log.id = this.generateID();
      this.log.date = Date.now();
      const newLog = Object.assign({}, this.log);
      this.logService.addLog(newLog);
    } else {
      const updatedLog = Object.assign({}, this.log);
      this.logService.updateLog(updatedLog);
    }

    this.clearState();
  }

 clearState() {
    this.isNew = true;
    this.form.reset();
   this.log = { id: null, text: null, date: null };
   this.logService.resetState();
  }

  generateID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
