import { Injectable, Inject } from '@angular/core';
import { WINDOW } from 'ngx-window-token';

@Injectable({
  providedIn: 'root',
})
export class LpWidgetSDKService {
  private lpWidgetSDK;
  private widgetSDKAPI;
  private _window;
  constructor(@Inject(WINDOW) _window) {
    this._window = _window;
  }
  init() {
    this.widgetSDKAPI = this._window.lpTag.LPWidgetSDK.API;
    const bindingEvent = [this.widgetSDKAPI.events.CONVERSATION_INFO, this.widgetSDKAPI.events.MESSAGES],
      opts = { bind: {} };

    bindingEvent.forEach((eventName) => {
      opts.bind[eventName] = { func: this.onEvent, context: this };
    });

    this.lpWidgetSDK = this._window.lpTag.LPWidgetSDK.init(opts);
  }
  onEvent(eventData) {
    if (eventData && this.widgetSDKAPI.events.MESSAGES === eventData.type) {
      var content = eventData.data.content;
      console.log("MESSAGES data: ", eventData);
      if (content.indexOf("disposeWidget") > -1) {
        this.disposeWidget();
      }
    } else if (eventData && this.widgetSDKAPI.events.CONVERSATION_INFO === eventData.type) {
      console.log("CONVERSATION_INFO data: ", eventData);
    }
    this.sendNotification("Event received!");
  }
  sendNotification(text) {
    if (typeof text === "string") {
      this.lpWidgetSDK.notify({ content: text }, function (err) {
        if (err) {
          console.log("Error on sending notification from widget");
        }
      });
    }
  }
  disposeWidget() {
    console.log('dispose widget called');
    this.lpWidgetSDK.dispose(function (data) {
      console.log("widget disposed:", data);
    });
  }
}