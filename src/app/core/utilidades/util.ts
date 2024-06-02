
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

export class Utils {

  constructor(private http: HttpClient) {}


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


  
  static async imageToByteFromUrl(imageUrl: string, type: any): Promise<string> {
    var response: any;

    if(type=="Movies" || type=="Series" || type == "Books" || type == "Games"){
      response = await fetch(/*'https://cors-anywhere.herokuapp.com/' + */imageUrl);
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
}


  static byteToImage(byteImage: any): any {
    return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
      + byteImage);
  }

}
