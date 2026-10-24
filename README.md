# PokéDex Explorer 🔴⚪

Aplicación móvil desarrollada con **React Native** y **Expo** para la exploración y consulta de Pokémon, consumiendo la API REST pública de [PokéAPI](https://pokeapi.co/).

Proyecto desarrollado en parejas para el taller de desarrollo móvil, implementando buenas prácticas de arquitectura de software, desacoplamiento de capas, virtualización de listas y diseño modular.

---

## 👥 Integrantes y Distribución del Trabajo

| Estudiante | Responsabilidad en el Proyecto | Commits Asignados |
| :--- | :--- | :--- |
| **Juan David Cuervo** | Configuración base, capa de servicios de red (`pokemonService.js`), constantes y componentes de feedback visual | Commits 1, 2 y 3 |
| **Juan Felipe Marín** | Vista de listado con scroll infinito (`PokemonListScreen`), vista de detalle con estadísticas (`PokemonDetailScreen`), orquestación general (`App.js`) y documentación | Commits 4, 5 y 6 |

---

## 📂 1. Estructura del Proyecto y Responsabilidades

```plaintext
tallerApiPokemon/
├── App.js                         # Componente raíz: orquestador de navegación por estado y SafeArea
├── app.json                       # Configuración de Expo y metadatos de la aplicación
├── package.json                   # Dependencias del proyecto y scripts de ejecución
├── src/
│   ├── components/                # Componentes reutilizables y modulares de la interfaz
│   │   ├── Header.js              # Encabezado temático con identidad visual de PokéDex
│   │   ├── SearchBar.js           # Barra de búsqueda controlada con TextInput y acción de borrado
│   │   ├── PokemonCard.js         # Tarjeta de cuadrícula con imagen remota, ID formateado y nombre
│   │   ├── TypeBadge.js           # Distintivo visual por tipo elemental con color y traducción al español
│   │   ├── StatBar.js             # Barra gráfica horizontal proporcional para estadísticas base (0 a 255)
│   │   ├── LoadingIndicator.js    # Estado de carga accesible con ActivityIndicator y mensaje
│   │   ├── ErrorMessage.js        # Estado de error amigable con botón de reintento
│   │   └── EmptyState.js          # Estado visual para búsquedas sin coincidencias o 404
│   ├── constants/
│   │   └── typeColors.js          # Paleta de colores oficial por tipo y diccionarios de traducción
│   ├── screens/                   # Pantallas completas de la aplicación
│   │   ├── PokemonListScreen.js   # Pantalla principal: FlatList de 2 columnas, paginación infinita y búsqueda
│   │   └── PokemonDetailScreen.js # Ficha técnica: imagen HD, tipos, medidas (m y kg) y barras de stats
│   └── services/
│       └── pokemonService.js      # Capa de red desacoplada: peticiones fetch, paginación y transformaciones
└── README.md                      # Documentación completa del proyecto y guía de sustentación
```

---

## 🏛️ 2. Justificación de la Arquitectura: Separación de Red y UI

En este proyecto se implementó una **regla de arquitectura estricta**: ninguna pantalla (`Screen`) ni componente visual (`Component`) realiza llamadas directas mediante `fetch` o conoce los endpoints de la API. Toda la interacción con la PokéAPI está centralizada en `src/services/pokemonService.js`.

### Beneficios del Desacoplamiento:
1. **Principio de Responsabilidad Única (SRP):** Los componentes visuales se limitan a gestionar su estado local y proyectar la interfaz de usuario en función de las propiedades (`props`) y estados (`useState`). No se sobrecargan con lógica de red, armado de URLs ni deserialización de payloads complejos.
2. **Centralización de la Transformación de Datos:** En el servicio se convierten y normalizan las unidades de medida (de decímetros a metros `height / 10`, y de hectogramos a kilogramos `weight / 10`), el formateo de IDs con tres dígitos (`padStart(3, '0')`), y el manejo especial del error `404` cuando un Pokémon no existe.
3. **Mantenibilidad y Reutilización:** Si la PokéAPI cambia un endpoint, la estructura de sus datos o si en el futuro se migra a GraphQL o a un cliente con caché (como TanStack Query), únicamente se modifica el archivo `pokemonService.js` sin alterar una sola línea de código en las pantallas ni componentes.
4. **Testabilidad:** Facilita la creación de pruebas unitarias al permitir mockear el servicio de red de forma aislada sin tener que renderizar árboles de componentes nativos.

---

## 🧠 3. Preguntas de Reflexión para la Sustentación

### A. ¿Por qué es fundamental desacoplar la capa de servicios (red) de los componentes de UI?
En aplicaciones móviles profesionales, mezclar la lógica de red (`fetch`, manipulación de cabeceras, transformación de JSON) dentro del cuerpo de los componentes o hooks de interfaz produce código conocido como *"Spaghetti Code"*. 

Desacoplar la red permite que la interfaz sea **agnóstica del origen de los datos**. Un componente como `PokemonCard` o `PokemonListScreen` no necesita saber si los datos provienen de una API REST pública, una base de datos local SQLite o datos en memoria para pruebas. Esto incrementa la cohesión del sistema, disminuye el acoplamiento y previene errores colaterales durante el ciclo de vida del software.

### B. ¿Cuál es la importancia del array de dependencias en `useEffect` y qué problemas previene?
El segundo parámetro de `useEffect` determina bajo qué condiciones debe volver a ejecutarse la función de efecto secundario:

- **Array vacío `[]`:** El efecto se ejecuta **únicamente una vez**, justo después del primer renderizado (montaje del componente). Es el patrón utilizado en `PokemonListScreen` para realizar la carga inicial de los primeros 20 Pokémon.
- **Array con dependencias `[pokemonId]`:** El efecto se dispara en el montaje y **cada vez que el valor de alguna de sus dependencias cambia**. En `PokemonDetailScreen`, si el usuario selecciona otro Pokémon, el efecto detecta el cambio de `pokemonId` y consulta la nueva ficha técnica automáticamente.
- **Sin array de dependencias:** El efecto se ejecutaría después de **cada renderizado**. Si dentro del efecto se actualiza un estado (`setPokemonList`), provocaría un nuevo renderizado, lo que dispararía el efecto otra vez, generando un **bucle infinito** de peticiones a la API que satura el dispositivo, agota la cuota del servidor y bloquea la aplicación.

### C. ¿Cómo funciona la virtualización de `FlatList` y en qué se diferencia de un `ScrollView` tradicional?
- **`ScrollView` tradicional:** Renderiza en memoria el árbol completo de componentes hijos simultáneamente, sin importar si están visibles en la pantalla o si el usuario aún no ha hecho scroll. Si la lista contiene 1000 Pokémon con imágenes remotas, `ScrollView` creará 1000 instancias nativas al mismo tiempo, lo que ocasiona un alto consumo de memoria RAM, lentitud, caída de cuadros por segundo (FPS) y eventual cierre forzoso de la aplicación por falta de memoria (OOM - Out of Memory).
- **`FlatList` (Virtualización):** Emplea un mecanismo inteligente de **reciclaje de celdas y ventana deslizante** (`windowing`). Solo mantiene en memoria y renderiza los elementos que actualmente están visibles en la ventana gráfica más un pequeño margen superior e inferior (`windowSize`). A medida que el usuario se desplaza, los elementos que salen de la vista son desmontados y sus contenedores nativos son reciclados para los nuevos elementos entrantes. Gracias a esto, el consumo de memoria se mantiene constante $\mathcal{O}(1)$ independientemente de si la lista tiene 20 o 1000 Pokémon.

---

## 🛠️ 4. Pistas Técnicas Obligatorias Implementadas

- **Imágenes Remotas:** Se establecieron propiedades explícitas de `width` y `height` en todas las etiquetas `<Image>` (obligatorio en React Native para URLs remotas).
- **Formateo de ID:** Uso de `String(id).padStart(3, '0')` para estandarizar códigos tipo `#001`, `#025`, etc.
- **Manejo de Errores 404:** Verificación de `response.ok` antes de invocar `response.json()`, evitando excepciones de parseo ante respuestas de error en texto plano provenientes de la PokéAPI.
- **Búsqueda Óptima:** Configuración de `TextInput` con `autoCapitalize="none"` y `autoCorrect={false}` para evitar autocorrecciones indebidas de nombres y números.
- **Scroll Infinito Seguro:** Control de concurrencia mediante flags (`isLoadingMore`, `hasMore`) en el manejador `onEndReached` de `FlatList`, impidiendo peticiones duplicadas simultáneas.
- **Conversión de Unidades:** Conversión adecuada de la escala de la API (decímetros a metros y hectogramos a kilogramos).

---

## 🚀 5. Instalación y Ejecución

Para ejecutar el proyecto en tu entorno local:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/JuandDavid/tallerApiPokemon.git
   cd tallerApiPokemon
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo de Expo:**
   ```bash
   npx expo start
   ```

4. **Visualizar la aplicación:**
   - Presiona `a` para abrir en emulador de Android.
   - Presiona `w` para abrir en el navegador web.
   - Escanea el código QR desde la aplicación **Expo Go** en tu dispositivo móvil físico.

---

## 📜 6. Historial de Commits del Proyecto

El desarrollo se distribuyó equitativamente en 6 commits atómicos y descriptivos:

1. `chore: initialize expo project with blank template and base dependencies` *(Juan David Cuervo)*
2. `feat: implement pokeapi service layer for pagination and search` *(Juan David Cuervo)*
3. `add ui feedback components and typre color constants` *(Juan David Cuervo)*
4. `feat: implement pokemon list view with 2-column grid and infinite scroll` *(Juan Felipe Marín)*
5. `feat: implement pokemon detail view with type badges and base stats` *(Juan Felipe Marín)*
6. `feat: integrate app navigation with safe area and finalize documentation` *(Juan Felipe Marín)*
