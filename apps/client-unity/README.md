# @earth365/client-unity

The EARTH-365 Unity game client. Android-first, designed to scale to PC and iOS in later phases.

> **Status: Phase 0 scaffold.** Folder skeleton only. The actual Unity project is created by opening this directory in Unity Hub — see "Setup" below.

## Why Unity?

- Cross-platform out of the box (Android, iOS, PC, WebGL, Switch, Xbox).
- Huge asset store and tooling ecosystem.
- C# scripting is fast to iterate in.
- Photon Fusion / Mirror integrations are first-class.
- Battle-tested in social-life-sim shipping titles.

See [`/docs/ARCHITECTURE.md`](../../docs/ARCHITECTURE.md) and [`/docs/BLUEPRINT.md`](../../docs/BLUEPRINT.md) for the full plan.

## Target setup

| Setting | Value |
|---|---|
| Unity version | **2022.3 LTS** (use 2022.3.40f1 or newer) |
| Initial build target | **Android** |
| Render pipeline | URP (Universal Render Pipeline) |
| Multiplayer | Photon Fusion (Phase 2+) |
| Input system | New Input System package |
| Scripting backend | IL2CPP (Android release builds) |
| Minimum Android API | 24 (Android 7.0 — covers 95%+ of devices) |
| Auth | Google Sign-In (Android), Sign in with Apple (iOS), email/password fallback |

## Setup (one-time)

1. Install [Unity Hub](https://unity.com/download).
2. Through Unity Hub, install **Unity 2022.3 LTS** with the **Android Build Support** module (includes Android SDK + NDK + OpenJDK).
3. Open Unity Hub → "Add project from disk" → select this `apps/client-unity` folder.
4. Unity will scaffold its own `ProjectSettings/`, `Library/`, `Packages/manifest.json` on first open. **Most of these are git-ignored** (see the root `.gitignore`); only `ProjectSettings/` and `Packages/manifest.json` need to be committed for collaborators to share the project setup.
5. Switch the build target to Android (File → Build Settings → Android → Switch Platform).

## Folder layout (to be created by Unity on first open)

```
apps/client-unity/
├── Assets/
│   ├── Scripts/
│   │   ├── Net/              # REST + WS clients pointing at @earth365/api
│   │   ├── UI/
│   │   │   └── The365App/    # In-game phone UI
│   │   ├── World/            # Spawn, plots, building
│   │   ├── Character/        # Avatar, animations, customization
│   │   └── Bootstrap.cs      # Entry point
│   ├── Prefabs/
│   ├── Scenes/
│   │   ├── Boot.unity
│   │   ├── Login.unity
│   │   ├── CharacterCreate.unity
│   │   └── World.unity
│   └── Settings/             # URP, input actions, etc
├── Packages/
│   └── manifest.json         # COMMIT THIS
├── ProjectSettings/           # COMMIT THIS
└── (everything else is gitignored: Library/, Temp/, Builds/, Logs/)
```

## Connecting to the backend

The Unity client talks to `@earth365/api` over HTTPS (REST) and WebSockets (realtime).

For local development:

```
http://10.0.2.2:3000     # Android emulator (host loopback)
http://localhost:3000    # PC editor / standalone build on same machine
```

Configure the base URL via `Assets/Resources/network-config.json` (created when the Net layer is implemented).

## Recommended first scripts (next PR)

1. `Bootstrap.cs` — initializes singletons (network, auth, audio).
2. `Net/EarthApiClient.cs` — typed wrapper over the REST API. Will be auto-generated from the backend's Swagger spec in a follow-up PR.
3. `UI/Login/LoginPanel.cs` — Google Sign-In flow.
4. `UI/CharacterCreate/CharacterCreatePanel.cs` — basic appearance sliders.
5. `World/PlotSpawner.cs` — fetch plots from the API and instantiate prefabs.

## Why no `.unityproj` / `.csproj` / `.sln` checked in

Unity generates those files on every open and they change constantly. They're in `.gitignore`. Open the project in Unity to regenerate.

## Why no `Library/` checked in

It's a multi-GB Unity-generated cache. Git-ignored.
