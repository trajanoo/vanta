import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CriaProjeto {
  salvarProjeto() {
    console.log("projeto salvo com sucesso");
  }
}
