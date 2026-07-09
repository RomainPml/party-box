# Build APK — PartyBox

L'app est configurée pour EAS Build (voir `eas.json`, profil **preview** = APK installable).
Ces commandes nécessitent **ton compte Expo** (connexion interactive) — à lancer par toi.

## Prérequis (une fois)

```bash
npm install -g eas-cli      # ou utilise `npx eas` partout
eas login                   # connexion à ton compte Expo (crée-en un gratuit sur expo.dev si besoin)
eas init                    # crée le projet EAS et écrit le projectId dans app.json
```

## Générer l'APK (profil preview)

```bash
eas build -p android --profile preview
```

- Le build tourne sur les serveurs EAS (~10-20 min). À la fin, un lien de téléchargement de l'`.apk` s'affiche.
- Installe l'`.apk` sur ton Android (autorise « sources inconnues » si demandé).

## Tester en local avant le build (optionnel, rapide)

```bash
npm run android             # nécessite un émulateur Android ou un tél branché en USB (debug)
# ou
npx expo start              # puis scanne le QR avec Expo Go (⚠️ le tilt/haptics ne marchent qu'en build natif, pas dans Expo Go web)
```

## À vérifier sur device réel

- **Devine-tête** : calibration du tilt (capteur `expo-sensors`). Si « trouvé » et « passer » sont inversés, ajuster les signes dans `src/games/_engine/useTilt.ts` (seuils sur `z`).
- **Haptics** : retours vibrants (ne fonctionnent qu'en natif, pas en web).

## Version de prod (plus tard, pour le Play Store)

```bash
eas build -p android --profile production   # génère un .aab pour le Play Store
```
