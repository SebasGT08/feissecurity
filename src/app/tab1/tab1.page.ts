import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { PLATFORM_ID, Inject} from '@angular/core';
import { isPlatformBrowser} from '@angular/common';
import * as faceapi from 'face-api.js';
import { EmbeddingsService } from '../services/embeddings.service';



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, AfterViewInit {

  @ViewChild('video', { static: true }) video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private faceMatcher!: faceapi.FaceMatcher;
  isBrowser: boolean;

  constructor(
    private embeddingsService: EmbeddingsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { 
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  async ngOnInit() {
    if (this.isBrowser) {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models/tiny_face_detector');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models/face_landmark_68');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models/face_recognition');
      await faceapi.nets.tinyYolov2.loadFromUri('/assets/models/tiny_yolov2');

      await this.embeddingsService.loadEmbeddings();
      this.faceMatcher = new faceapi.FaceMatcher(this.embeddingsService.getEmbeddings(), 0.6);
    }
  }

  async ngAfterViewInit() {
    if (this.isBrowser) {
      this.startVideo();
    }
  }

  startVideo() {
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then(stream => {
        this.video.nativeElement.srcObject = stream;
        this.video.nativeElement.onloadedmetadata = () => {
          this.video.nativeElement.play();
          this.detectFaces();
        };
      })
      .catch(err => console.error('Error accessing camera: ', err));
  }

  async detectFaces() {
    const videoElement = this.video.nativeElement;
    const canvasElement = this.canvas.nativeElement;

    const displaySize = { width: videoElement.videoWidth, height: videoElement.videoHeight };
    faceapi.matchDimensions(canvasElement, displaySize);

    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      const results = resizedDetections.map(d => {
        return this.faceMatcher.findBestMatch(d.descriptor);
      });

      const context = canvasElement.getContext('2d');
      if (context) {
        context.clearRect(0, 0, canvasElement.width, canvasElement.height);
        faceapi.draw.drawDetections(canvasElement, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvasElement, resizedDetections);

        results.forEach((result, i) => {
          const box = resizedDetections[i].detection.box;
          const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() });
          drawBox.draw(canvasElement);
        });
      }
    }, 100);
  }
}