import { Component, OnInit } from '@angular/core';
import { Device } from './device';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements OnInit {
  videoDevices: Device[] = [];

  constructor() { }

  async ngOnInit() {
    const supported = await this.isCameraSupported();
    if (supported) {
      this.getVideoDevices();
      this.startCamera();
    }
  }

  async isCameraSupported(): Promise<boolean> {
    let supported = false;
    const constraints = {
      video: true
    };

    try {
      const videoDevice = await navigator.mediaDevices.getUserMedia(constraints);
      supported = videoDevice == null || videoDevice === undefined ? false : true;
    } catch (error) {}

    return supported;
  }

  startCamera() {
    const player: any = document.getElementById('player');
    const constraints = {
      video: {
        deviceId: {exact: this.videoDevices[1].Id}
      }
    };

    console.log(constraints);

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      player.srcObject = stream;
    });
  }

  async getVideoDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    devices.forEach((value, index) => {
      if (value.kind === 'videoinput') {
        this.videoDevices.push({
          Id: value.deviceId,
          Name: value.label
        });
      }
    });
  }
}
