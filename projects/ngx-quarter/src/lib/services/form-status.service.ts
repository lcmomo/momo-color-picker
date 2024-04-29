import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class NzFormStatusService {
  formStatusChanges = new ReplaySubject<{ status: string; hasFeedback: boolean }>(1);
}
