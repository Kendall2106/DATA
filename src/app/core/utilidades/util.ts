
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


  static imageToByte(file: File | Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          const MAX_WIDTH = 800; // Cambia esto según lo que necesites
          const MAX_HEIGHT = 800;
  
          let width = img.width;
          let height = img.height;
  
          // Redimensionar manteniendo proporciones
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
  
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
  
          if (!ctx) {
            reject('No se pudo obtener el contexto del canvas');
            return;
          }
  
          ctx.drawImage(img, 0, 0, width, height);
  
          // Comprimir a JPEG con calidad 0.7
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // puedes ajustar la calidad
  
          // Extraer solo la parte base64
          const base64 = compressedDataUrl.split('base64,')[1];
          resolve(base64);
        };
  
        img.onerror = reject;
        img.src = e.target.result;
      };
  
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
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
