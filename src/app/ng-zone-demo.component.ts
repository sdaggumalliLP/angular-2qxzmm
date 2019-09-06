import {
  Component, NgZone, OnInit
} from '@angular/core';
import { NgIf } from '@angular/common';

import { DynamicScriptLoaderService } from './dynamic-script-loader.service';
import { LpWidgetSDKService } from './lp-widget-sdk.service'

@Component({
  selector: 'ng-zone-demo',
  template: `
    <h2>Demo: NgZone</h2>

    <p>Progress: {{progress}}%</p>
    <p *ngIf="progress >= 100">Done processing {{label}} of Angular zone!</p>

    <button (click)="processWithinAngularZone()">Process within Angular zone</button>
    <button (click)="processOutsideOfAngularZone()">Process outside of Angular zone</button>
    <button (click)="disposeWidget()">Dispose Widget</button>
    <button (click)="disposeWidgetViaMessage()">Dispose Widget via Message</button>
  `,
})
export class NgZoneDemo implements OnInit {
  progress: number = 0;
  label: string;

  constructor(private _ngZone: NgZone, private dynamicScriptLoader: DynamicScriptLoaderService, private lpWidgetSDK: LpWidgetSDKService) { }
  ngOnInit() {
    this.dynamicScriptLoader.load('lpWidgetSDK').then(data => {
      // Script Loaded Successfully
      this.lpWidgetSDK.init();
    }).catch(error => console.log(error));
  }
  // Loop inside the Angular zone
  // so the UI DOES refresh after each setTimeout cycle
  processWithinAngularZone() {
    this.label = 'inside';
    this.progress = 0;
    this._increaseProgress(() => console.log('Inside Done!'));
  }

  // Loop outside of the Angular zone
  // so the UI DOES NOT refresh after each setTimeout cycle
  processOutsideOfAngularZone() {
    this.label = 'outside';
    this.progress = 0;
    this._ngZone.runOutsideAngular(() => {
      this._increaseProgress(() => {
        // reenter the Angular zone and display done
        this._ngZone.run(() => { console.log('Outside Done!'); });
      });
    });
  }

  _increaseProgress(doneCallback: () => void) {
    this.progress += 1;
    console.log(`Current progress: ${this.progress}%`);

    if (this.progress < 100) {
      window.setTimeout(() => this._increaseProgress(doneCallback), 10);
    } else {
      doneCallback();
    }
  }
  disposeWidget() {
    this.lpWidgetSDK.disposeWidget();
  }
  disposeWidgetViaMessage() {
    this.lpWidgetSDK.disposeWidgetViaMessage();
  }
}