# 🚀 Guía de Deployment - PetLink

## 📋 Requisitos previos

- Cuenta en [GitHub](https://github.com)
- Cuenta en [Render](https://render.com) (para backend)
- Cuenta en [Vercel](https://vercel.com) (para frontends)
- Cuenta en [Supabase](https://supabase.com) (base de datos)

---

## 🗂️ Arquitectura del proyecto

```
PetLink/
├── server/           → Backend (Node.js + Express + Socket.IO)
├── admin-app/        → Frontend Admin (Vite)
└── padrino-app/      → Frontend Padrino (Vite)
```

---

## 📦 PASO 1: Preparar el proyecto

### 1.1 Hacer commit de los cambios

```bash
git add .
git commit -m "feat: preparar proyecto para deployment"
git push origin fix/admin-app
```

### 1.2 Subir a GitHub (si no lo has hecho)

```bash
# Si no tienes repositorio remoto
git remote add origin https://github.com/tu-usuario/petlink.git
git branch -M main
git push -u origin main
```

---

## 🖥️ PASO 2: Desplegar el BACKEND en Render

### 2.1 Crear nuevo Web Service

1. Ve a [https://dashboard.render.com](https://dashboard.render.com)
2. Click en **"New +"** → **"Web Service"**
3. Conecta tu repositorio de GitHub
4. Configuración:
   - **Name**: `petlink-backend`
   - **Region**: Oregon (o el más cercano)
   - **Branch**: `main`
   - **Root Directory**: Dejar vacío
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 2.2 Variables de entorno en Render

En la sección "Environment":

```
NODE_ENV=production
PORT=5050
SUPABASE_URL=tu_supabase_url
SUPABASE_KEY=tu_supabase_anon_key
TWILIO_ACCOUNT_SID=tu_twilio_sid
TWILIO_AUTH_TOKEN=tu_twilio_token
TWILIO_PHONE_NUMBER=tu_numero_twilio
JWT_SECRET=tu_secret_key_segura
```

### 2.3 Copiar la URL del backend

Una vez desplegado, copia la URL (ejemplo: `https://petlink-backend.onrender.com`)

---

## 🌐 PASO 3: Desplegar ADMIN-APP en Vercel

### 3.1 Crear nuevo proyecto en Vercel

1. Ve a [https://vercel.com/new](https://vercel.com/new)
2. Importa tu repositorio de GitHub
3. Configuración:
   - **Project Name**: `petlink-admin`
   - **Framework Preset**: Other
   - **Root Directory**: `./` (raíz del proyecto)
   - **Build Command**: `npm run build:admin`
   - **Output Directory**: `dist/admin-app`

### 3.2 Variables de entorno en Vercel (Admin)

En "Environment Variables":

```
VITE_API_URL=https://petlink-backend.onrender.com/api
```

### 3.3 Deploy

Click en **"Deploy"** y espera a que termine.

---

## 🌐 PASO 4: Desplegar PADRINO-APP en Vercel

### 4.1 Crear otro proyecto en Vercel

1. Ve a [https://vercel.com/new](https://vercel.com/new)
2. Importa el **mismo** repositorio de GitHub
3. Configuración:
   - **Project Name**: `petlink-padrino`
   - **Framework Preset**: Other
   - **Root Directory**: `./` (raíz del proyecto)
   - **Build Command**: `npm run build:padrino`
   - **Output Directory**: `dist/padrino-app`

### 4.2 Variables de entorno en Vercel (Padrino)

En "Environment Variables":

```
VITE_API_URL=https://petlink-backend.onrender.com/api
```

### 4.3 Deploy

Click en **"Deploy"** y espera a que termine.

---

## 🔧 PASO 5: Configurar CORS en el backend

Actualiza `server/index.js` para permitir tus dominios de Vercel:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://petlink-admin.vercel.app',
    'https://petlink-padrino.vercel.app'
  ],
  credentials: true
}));
```

Hacer commit y push para que Render redeploy automáticamente.

---

## ✅ PASO 6: Verificar que todo funcione

### 6.1 Probar Admin-app

1. Ve a `https://petlink-admin.vercel.app`
2. Intenta hacer login
3. Verifica que las estadísticas se cargan
4. Prueba la conexión WebSocket

### 6.2 Probar Padrino-app

1. Ve a `https://petlink-padrino.vercel.app`
2. Intenta hacer login
3. Haz una donación
4. Verifica que las estadísticas se actualicen en admin-app

---

## 🐛 Troubleshooting

### Error: "Failed to fetch"
- Verifica que `VITE_API_URL` esté configurado correctamente
- Verifica que el backend en Render esté corriendo

### Error: "Socket.IO not connecting"
- Verifica que Render permita WebSockets (gratis sí lo permite)
- Revisa los logs en Render Dashboard

### Error: "CORS blocked"
- Agrega tu dominio de Vercel al array de CORS en `server/index.js`

---

## 📝 URLs finales

- **Backend**: https://petlink-backend.onrender.com
- **Admin**: https://petlink-admin.vercel.app
- **Padrino**: https://petlink-padrino.vercel.app

---

## 🔄 Actualizaciones futuras

Cada vez que hagas cambios:

```bash
git add .
git commit -m "tu mensaje"
git push
```

- ✅ **Render** redeploy automáticamente el backend
- ✅ **Vercel** redeploy automáticamente ambos frontends

---

## 💰 Costos

- ✅ **Render Free Tier**: Gratis (pero el servicio se "duerme" después de 15 min de inactividad)
- ✅ **Vercel Free Tier**: Gratis (100 GB bandwidth/mes)
- ✅ **Supabase Free Tier**: Gratis (500 MB database)

**Total: $0/mes** 🎉

