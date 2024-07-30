import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFirestore, DocumentData, QuerySnapshot } from '@angular/fire/compat/firestore';
import { EmbeddingsService } from '../services/embeddings.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  username: string = '';
  password: string = '';

  constructor(
    private navCtrl: NavController,
    private firestore: AngularFirestore,
    private embeddingsService: EmbeddingsService
  ) {
    this.listUsers();  // Lista los usuarios al iniciar la página
  }

  async login() {
    try {
      const userDoc = await this.firestore.collection('users', ref => 
        ref.where('username', '==', this.username).where('password', '==', this.password)).get().toPromise() as QuerySnapshot<DocumentData>;
      
      if (userDoc && !userDoc.empty) {
        const user = userDoc.docs[0].data() as { username: string, [key: string]: any };
        console.log('Usuario autenticado:', user);
        
        // Almacenar el nombre de archivo del usuario autenticado en el almacenamiento local
        const fileName = this.getFileName(user.username);
        localStorage.setItem('userFile', fileName);
        
        // Almacenar el estado de autenticación en el almacenamiento local
        localStorage.setItem('isAuthenticated', 'true');

        // Cargar embeddings del usuario autenticado
        await this.embeddingsService.loadEmbeddings(fileName);

        // Redirigir a Tab1Page después de iniciar sesión
        this.navCtrl.navigateRoot('/tabs/tab1');
      } else {
        throw new Error('Autenticación fallida');
      }
    } catch (error) {
      console.error('Error de autenticación:', error);
      // Mostrar un mensaje de error al usuario
      alert('Autenticación fallida. Por favor, revise sus credenciales e intente nuevamente.');
    }
  }

  getFileName(username: string): string {
    switch (username.toLowerCase()) {
      case 'bryam':
        return 'Bryam.json';
      case 'michelle':
        return 'embeddings.json';
      case 'sebas':
        return 'embeddings.json';
      case 'lisseth':
        return 'embeddings.json';
      default:
        throw new Error('Nombre de usuario no reconocido');
    }
  }

  async listUsers() {
    try {
      const usersSnapshot = await this.firestore.collection('users').get().toPromise();
      const users = usersSnapshot?.docs.map(doc => doc.data());
      console.log('Lista de usuarios:', users);
    } catch (error) {
      console.error('Error al listar los usuarios:', error);
    }
  }
}
