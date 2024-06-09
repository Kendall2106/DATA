
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

  //convertir imagen a byte
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



  /*static async imageToByteFromUrl(imageUrl: string, type: any): Promise<string> {
    var response: any;

      if(type=="Movies" || type=="Series" || type=="Books"|| type=="Games"){
        response = await fetch('https://corsproxy.io/?' + encodeURIComponent(imageUrl));
      }else{ 
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

    return byteImagePromise;
  }*/



  static byteToImage(byteImage: any): any {
    return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
      + byteImage);
  }


  static async imageToByteFromUrl(imageUrl: string, type: any): Promise<string> {
    var response: any;

    if (type == "Movies" || type == "Series" || type == "Books" || type == "Games") {
        response = await fetch('https://corsproxy.io/?' + encodeURIComponent(imageUrl));
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

    // Verificar si el tamaño de la imagen es mayor de 1 MB
    if ((base64String.length * 3 / 4) > 1 * 1000 * 1000) {
        // Reducir la resolución de la imagen
        console.log("deberia entrar");
        base64String = await this.resizeImage(blob);
    }

    return base64String;
}

static async resizeImage(blob: Blob): Promise<string> {
    // Crear una imagen HTML
    const img = new Image();
    const objectUrl = URL.createObjectURL(blob);
    
    const imgLoadedPromise = new Promise<HTMLImageElement>((resolve, reject) => {
        img.onload = () => {
            URL.revokeObjectURL(objectUrl); // Liberar el objeto URL
            resolve(img);
        };
        img.onerror = reject;
        img.src = objectUrl;
    });

    const imgElement = await imgLoadedPromise;

    // Crear un canvas y dibujar la imagen redimensionada
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const targetWidth = imgElement.width / 5; // Cambia esto a la resolución deseada
    const targetHeight = imgElement.height / 5; // Cambia esto a la resolución deseada

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    ctx?.drawImage(imgElement, 0, 0, targetWidth, targetHeight);

    // Convertir el canvas a una cadena de bytes
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
