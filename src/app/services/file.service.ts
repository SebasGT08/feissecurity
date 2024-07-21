import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) {}

  async copyModelsToLocal() {
    const modelFiles = [
      'tiny_face_detector_model-weights_manifest.json',
      'tiny_face_detector_model.bin',
      'face_landmark_68_model-weights_manifest.json',
      'face_landmark_68_model.bin',
      'face_recognition_model-weights_manifest.json',
      'face_recognition_model.bin'
    ];

    for (const fileName of modelFiles) {
      try {
        const response = await this.http.get(`./assets/${fileName}`, { responseType: 'blob' }).toPromise();
        if (response) {
          const reader = new FileReader();
          reader.onload = async () => {
            const dataUrl = reader.result as string;
            const base64Data = dataUrl.split(',')[1];
            await Filesystem.writeFile({
              path: `models/${fileName}`,
              data: base64Data,
              directory: Directory.Data,
              encoding: Encoding.UTF8
            });
          };
          reader.readAsDataURL(response);
        } else {
          console.error(`Failed to fetch ${fileName}`);
        }
      } catch (error) {
        console.error(`Error fetching ${fileName}: `, error);
      }
    }
  }

  async readModelFile(path: string): Promise<Blob> {
    const result = await Filesystem.readFile({
      path: path,
      directory: Directory.Data,
      encoding: Encoding.UTF8
    });

    if (typeof result.data !== 'string') {
      throw new Error(`Expected string but got ${typeof result.data}`);
    }

    const byteCharacters = atob(result.data);
    const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'application/octet-stream' });
  }

  async readModelManifest(path: string) {
    const result = await Filesystem.readFile({
      path: path,
      directory: Directory.Data,
      encoding: Encoding.UTF8
    });

    if (typeof result.data !== 'string') {
      throw new Error(`Expected string but got ${typeof result.data}`);
    }

    return JSON.parse(result.data);
  }
}
