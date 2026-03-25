# Diagramas de Arquitectura y Navegación - GymTrack

Estos diagramas detallan la estructura interna de navegación y el flujo de estados manejado por la aplicación, útiles para la memoria escrita de tu Trabajo de Fin de Grado (TFC).

## 1. Diagrama de Navegación (Flujo Principal)

Este diagrama muestra cómo un usuario navega desde que abre la aplicación, incluyendo el enrutamiento inteligente (redirección) y el flujo interactivo de los entrenamientos.

```mermaid
graph TD
    A[app/index.tsx <br/> Smart Redirect] -->|isOnboarded == false| B(Flujo Onboarding)
    A -->|isOnboarded == true| C(Tab Navigator)

    subgraph Flujo Onboarding
        B1[NameScreen] --> B2[ObjectiveScreen]
        B2 --> B3[ActivityScreen]
        B3 --> B4[MeasurementsScreen]
        B4 --> B5[GeneratingScreen]
        B5 -->|Guardar en UserContext| C
    end

    subgraph Tab Navigator
        C1[Home / Dashboard] 
        C2[Discover / Routines]
        C3[Report / Stats]
        C4[Settings / Profile]
    end

    C --> C1
    C --> C2
    C --> C3
    C --> C4

    C1 -->|Comenzar Sesión Recomedada| W1(Routine Screen)
    C2 -->|Seleccionar Rutina Manual| W1
    W1 --> W2(Workout Player)
    W2 -->|Siguiente Ejercicio...| W2
    W2 -->|Finalizar Workout| W3(Success Screen)
    W3 -->|Completar sesión global| C1

    C4 -->|Cerrar Sesión / Reset| B
```

## 2. Diagrama de Estado Global (UserContext con TS)

Este diagrama detalla cómo el contexto `UserContext` administra el estado global, persistiendo la información con `AsyncStorage` a lo largo del ciclo de vida de la aplicación de React Native. Se ha implementado un patrón de "Discriminated Union" para gestionar el estado estrictamente tipado.

```mermaid
stateDiagram-v2
    [*] --> Loading: Inicio de Aplicación
    Loading --> Ready: Carga de @user_data exitosa
    Loading --> Error: Fallo de sistema / lectura en AsyncStorage

    state Ready {
        [*] --> UserData
        UserData --> completeWorkout() : Aumenta kcal, sesiones, racha y guarda historial
        UserData --> updateWater() : Registra hidratación diaria (estado local)
        UserData --> updateUser() : Modificaciones de perfil parciales (Onboarding)
        UserData --> resetUser() : Limpia estado en memoria local
    }
    
    Ready --> [*]: Logout / Borrado de Cuenta
```

---
*Generado para GymTrack - Carlota Rial.*
