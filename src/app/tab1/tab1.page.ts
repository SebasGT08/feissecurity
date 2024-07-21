import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as faceapi from 'face-api.js';
import { EmbeddingsService } from '../services/embeddings.service';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

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
    await this.loadModels();
    await this.embeddingsService.loadEmbeddings();
    this.faceMatcher = new faceapi.FaceMatcher(this.embeddingsService.getEmbeddings(), 0.6);
  }

  async ngAfterViewInit() {
    if (this.isBrowser) {
      this.startVideo();
    } else if (Capacitor.isNativePlatform()) {
      await this.captureVideo();
    }
  }

  async loadModels() {
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/assets/tiny_face_detector_model-weights_manifest.json');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/assets/face_landmark_68_model-weights_manifest.json');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/assets/face_recognition_model-weights_manifest.json');
    } catch (error) {
      console.error('Error al cargar los modelos: ', error);
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

  async captureVideo() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera
    });

    const videoElement = this.video.nativeElement;
    const filePath = Capacitor.convertFileSrc(image.path!);

    videoElement.src = filePath;
    videoElement.onloadedmetadata = () => {
      videoElement.play();
      this.detectFaces();
    };
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
      const results = resizedDetections.map(d => this.faceMatcher.findBestMatch(d.descriptor));

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
