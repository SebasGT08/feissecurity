import { Injectable } from '@angular/core';
import * as faceapi from 'face-api.js';

@Injectable({
  providedIn: 'root'
})

export class EmbeddingsService {
  private embeddings: { [label: string]: faceapi.LabeledFaceDescriptors } = {};

  constructor() { }

  async loadEmbeddings(): Promise<void> {
    const response = await fetch('/assets/embeddings.json');
    const data = await response.json();
    this.embeddings = this.createLabeledFaceDescriptors(data);
  }

  private createLabeledFaceDescriptors(data: any): { [label: string]: faceapi.LabeledFaceDescriptors } {
    const labeledDescriptors: { [label: string]: faceapi.LabeledFaceDescriptors } = {};

    for (const label in data) {
      if (data.hasOwnProperty(label)) {
        const descriptors = data[label].map((d: number[]) => new Float32Array(d));
        labeledDescriptors[label] = new faceapi.LabeledFaceDescriptors(label, descriptors);
      }
    }

    return labeledDescriptors;
  }

  getEmbeddings(): faceapi.LabeledFaceDescriptors[] {
    return Object.values(this.embeddings);
  }
}
