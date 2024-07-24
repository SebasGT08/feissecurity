import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class EnvioFireService {

  constructor(private firestore: AngularFirestore, private toastController: ToastController) { }

  async registerPerson(person: string) {
    const timestamp = new Date();
    try {
      await this.firestore.collection('registrations').add({
        person,
        timestamp
      });
      this.showToast('Registro completado enviado correctamente');
    } catch (error) {
      this.showToast('Error al enviar al servidor: ' + error, 'danger');
      console.error('Error registering person: ', error);
    }
  }

  async invalidRegister() {
    const timestamp = new Date();
    const person = 'Incorrecto';
    try {
      await this.firestore.collection('registrations').add({
        person,
        timestamp
      });
      this.showToast('No paso la validacion, Intente nuevamente ', 'danger');
    } catch (error) {
      this.showToast('Error al enviar al servidor: ' + error, 'danger');
    }
  }

  async showToast(message: string, color = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: color
    });
    await toast.present();
  }
}
