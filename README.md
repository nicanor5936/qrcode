# Générateur QR Code — guide complet (A à Z)

Application desktop Windows, gratuite, basée sur Electron (HTML/CSS/JS — les technos
que tu connais déjà). Elle génère des QR codes en direct, personnalisables
(couleur, taille, correction d'erreur), exportables en PNG.

## 1. Prérequis (une seule fois)

1. Installe **Node.js LTS** : https://nodejs.org (prends la version "LTS").
   Vérifie l'installation dans PowerShell :
   ```
   node -v
   npm -v
   ```

## 2. Récupérer le projet

Copie le dossier `qrcode-app` (celui que je t'ai fourni) où tu veux sur ton PC,
par exemple `C:\Users\TonNom\Projets\qrcode-app`.

## 3. Installer les dépendances

Ouvre PowerShell **dans le dossier du projet** et lance :
```
cd C:\Users\TonNom\Projets\qrcode-app
npm install
```
Ça télécharge Electron et la librairie `qrcode`. Ça peut prendre 1-2 minutes.

## 4. Tester l'application

```
npm start
```
Une fenêtre sombre style macOS s'ouvre avec le générateur. Tu peux :
- Taper un texte/lien dans la zone de contenu
- Ajuster taille, couleurs, marge, niveau de correction d'erreur
- Cliquer **Télécharger PNG** pour sauvegarder
- Cliquer **Copier l'image** pour la coller ailleurs directement

## 5. Générer un vrai .exe installable (distribution)

Une fois satisfait, transforme l'app en installeur Windows :
```
npm run build:win
```
Le résultat (installeur `.exe`) apparaît dans le dossier `dist/`.
Tu peux le donner à n'importe qui : double-clic → installation → icône sur le
bureau, comme n'importe quel logiciel Windows.

## 6. Personnaliser (optionnel)

- **Icône de l'app** : place un fichier `icon.ico` (256x256 recommandé) dans
  `assets/icon.ico`. Tu peux en générer un gratuitement sur
  https://icoconvert.com à partir d'un PNG.
- **Nom de l'app / éditeur** : modifie `productName` et `appId` dans
  `package.json`.
- **Couleurs / thème** : tout est dans `style.css` (variables en haut du fichier,
  section `:root`).
- **Ajouter des modes de QR code** (wifi, vCard, SMS...) : c'est juste du texte
  formaté avant d'être passé à `QRCode.toCanvas` dans `renderer.js` — je peux
  t'aider à ajouter ces formats si tu veux.

## Structure du projet

```
qrcode-app/
├── package.json     → config npm + electron-builder (génère le .exe)
├── main.js           → processus principal Electron (fenêtre, sauvegarde fichier)
├── index.html         → interface
├── style.css          → thème sombre style macOS
├── renderer.js        → logique génération QR + interactions
└── assets/            → icône de l'app (à fournir)
```

## Pistes d'évolution

- Génération de QR pour Wi-Fi (SSID + mot de passe), vCard, SMS, email
- Historique des QR générés (stockage local JSON)
- Logo/image au centre du QR code
- Version portable NICANOR OS (packagée dans ta distro)

Dis-moi si tu veux qu'on ajoute une de ces fonctionnalités, ou si tu préfères
une version en Python (customtkinter) plutôt qu'Electron.
