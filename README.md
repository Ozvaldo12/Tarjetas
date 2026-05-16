# 💳 Mis Tarjetas Pro

Gestor avanzado de tarjetas de crédito — PWA instalable construida con Vue 3, Vite y Firebase.

> **Demo en vivo:** [https://ozvaldo12.github.io/Tarjetas/](https://ozvaldo12.github.io/Tarjetas/)

---

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Framework | Vue 3 (Composition API + `<script setup>`) |
| Build | Vite |
| Estado | Pinia |
| Routing | Vue Router (Hash History) |
| Estilos | TailwindCSS |
| Auth | Firebase Authentication |
| Base de datos | Cloud Firestore (tiempo real) |
| PWA | vite-plugin-pwa + Workbox |
| Hosting | GitHub Pages (GitHub Actions CI/CD) |

---

## Instalación local

```bash
# Clonar repositorio
git clone https://github.com/Ozvaldo12/Tarjetas.git
cd Tarjetas

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales Firebase

# Iniciar en modo desarrollo
npm run dev
```

---

## Deploy a GitHub Pages

El despliegue es automático vía GitHub Actions al hacer push a `main`:

```
push → GitHub Actions → npm run build → dist/ → GitHub Pages
```

La configuración se encuentra en `.github/workflows/deploy.yml`.

---

## Documentación Técnica

La documentación completa del proyecto se organiza en dos niveles:

📄 **[docs/contexto_completo_proyecto.md](docs/contexto_completo_proyecto.md)** — Arquitectura base y contexto general

📁 **[docs/versions/](docs/versions/)** — Historial de cambios por versión

---

## Historial de Versiones

| Versión | Fecha | Descripción |
|---------|-------|-------------|
| [v1.0](docs/versions/v1.0.md) | Mayo 2026 | Release inicial: PWA, Firebase, GitHub Pages, arquitectura modular, CRUD compras |

---

## Estructura del proyecto

```
Tarjetas/
├── docs/
│   ├── contexto_completo_proyecto.md   # Documentación base arquitectónica
│   └── versions/
│       └── v1.0.md                     # Release inicial estable
├── public/
│   └── img/                            # Iconos PWA
├── src/
│   ├── layouts/                        # AppLayout (sidebar + bottom nav)
│   ├── views/                          # 7 vistas (Dashboard, Compras, Tarjetas, etc.)
│   ├── components/                     # Componentes Vue reutilizables
│   ├── composables/                    # Lógica compartida (cálculos, toasts)
│   ├── router/                         # Vue Router (Hash History)
│   ├── services/                       # Firebase init
│   └── stores/                         # Pinia (Auth + Cards)
├── .github/workflows/deploy.yml        # CI/CD automático
├── vite.config.js                      # Configuración Vite + PWA
└── package.json
```

---

## Licencia

Proyecto privado — Todos los derechos reservados.
