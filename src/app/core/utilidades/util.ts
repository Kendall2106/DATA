
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

export class Utils {

  constructor(private http: HttpClient) { }


  static _sanitizer: DomSanitizer;

  static getFormData(item: any) {
    var form_data = new FormData();

    for (var key in item) {
      form_data.append(key, item[key]);
    }
    return form_data;
  }


  static imageToByte(file: File | Blob): any {
    var byteImagePromise: Promise<string> =
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          resolve(e.target.result.split('base64,')[1] as string);
        };

        reader.readAsDataURL(file);
        reader.onerror = reject;
      });
    return byteImagePromise;
  }


  static byteToImage(byteImage: any): any {
    return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
      + byteImage);
  }


  static async imageToByteFromUrl(imageUrl: string, type: any): Promise<string> {
    var response: any;

    if (type == "Movies" || type == "Series" || type == "Books" || type == "Games") {
      response = await fetch('https://corsproxy.io/?key=577d7de5&url=' + encodeURIComponent(imageUrl));
    } else {
      response = await fetch(imageUrl);
    }

    if (!response.ok) {
      throw new Error('No se pudo cargar la imagen');
    }

    const blob = await response.blob();

    const byteImagePromise = new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        resolve(e.target.result.split('base64,')[1] as string);
      };
      reader.readAsDataURL(blob);
      reader.onerror = reject;
    });

    let base64String = await byteImagePromise;

    if ((base64String.length * 3 / 4) > 1 * 1000 * 1000) {
      console.log("deberia entrar");
      base64String = await this.resizeImage(blob);
    }

    return base64String;
  }


  static async resizeImage(blob: Blob): Promise<string> {
    const img = new Image();
    const objectUrl = URL.createObjectURL(blob);

    const imgLoadedPromise = new Promise<HTMLImageElement>((resolve, reject) => {
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(img);
      };
      img.onerror = reject;
      img.src = objectUrl;
    });

    const imgElement = await imgLoadedPromise;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const targetWidth = imgElement.width / 5;
    const targetHeight = imgElement.height / 5;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    ctx?.drawImage(imgElement, 0, 0, targetWidth, targetHeight);
    const resizedByteImagePromise = new Promise<string>((resolve, reject) => {
      canvas.toBlob((resizedBlob) => {
        if (!resizedBlob) {
          return reject(new Error('No se pudo crear el blob del canvas'));
        }
        const reader = new FileReader();
        reader.onload = (e: any) => {
          resolve(e.target.result.split('base64,')[1] as string);
        };
        reader.readAsDataURL(resizedBlob);
        reader.onerror = reject;
      });
    });

    return resizedByteImagePromise;
  }


}
