
# Proyecto de Detección Facial con IONIC, Angular y face-api.js

Este proyecto consiste en una aplicación IONIC que utiliza Angular, Firebase y face-api.js para detectar y validar rostros usando un archivo `embeddings.json` generado en otro proyecto con Python. Una vez validado el rostro, la aplicación registra la persona en Firebase.

## Tecnologías Utilizadas

- **IONIC**: Framework para el desarrollo de aplicaciones móviles híbridas.
- **Angular**: Framework para el desarrollo de aplicaciones web.
- **Firebase**: Plataforma para el desarrollo de aplicaciones móviles y web, utilizada para almacenar los registros de las personas detectadas.
- **face-api.js**: Librería para la detección y reconocimiento facial.
- **Capacitor**: Motor de ejecución nativo para aplicaciones híbridas.

## Requisitos Previos

- Node.js y npm instalados.
- IONIC CLI instalado: `npm install -g @ionic/cli`
- Capacitor CLI instalado: `npm install -g @capacitor/cli`
- Firebase configurado en tu proyecto IONIC.

## Instalación

1. **Clonar el repositorio**:
   ```sh
   git clone https://github.com/tu-usuario/tu-repositorio.git
   cd tu-repositorio
   ```

2. **Instalar dependencias**:
   ```sh
   npm install
   ```

3. **Agregar Capacitor a tu proyecto**:
   ```sh
   npx cap init
   ```

4. **Configurar Firebase**:
   - Añade tu configuración de Firebase en `src/environments/environment.ts`.
   - Instala las dependencias de Firebase:
     ```sh
     npm install firebase @angular/fire
     ```

5. **Agregar la plataforma deseada** (por ejemplo, Android):
   ```sh
   npx cap add android
   ```

## Ejecución

1. **Levantar la aplicación en el navegador**:
   ```sh
   ionic serve
   ```

2. **Sincronizar cambios con Capacitor**:
   ```sh
   npx cap sync
   ```

3. **Abrir la aplicación en Android Studio** (para plataforma Android):
   ```sh
   npx cap open android
   ```

## Estructura del Proyecto

El proyecto se organiza de la siguiente manera:

- **src/app/tab1/tab1.page.ts**: Componente principal que maneja la detección y validación facial.
- **src/services/embeddings.service.ts**: Servicio para cargar los embeddings faciales.
- **src/services/envio-fire.service.ts**: Servicio para enviar los registros de detección a Firebase.
- **assets/**: Directorio que contiene los modelos de `face-api.js`.

## Envío de Registros a Firebase

Una vez que se valida un rostro, se envía un registro a Firebase con el nombre de la persona y la fecha/hora del registro. Esto se maneja en el método `sendEntry` del componente `Tab1Page`.

## Despliegue

Para desplegar la aplicación en una plataforma nativa (por ejemplo, Android), sigue estos pasos:

1. **Construir la aplicación**:
   ```sh
   ionic build
   ```

2. **Sincronizar con Capacitor**:
   ```sh
   npx cap sync
   ```

3. **Abrir en el IDE correspondiente**:
   ```sh
   npx cap open android
   ```

4. **Compilar y ejecutar la aplicación desde el IDE**.

