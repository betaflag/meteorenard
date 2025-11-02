# Guide de Création de Pictogrammes de Vêtements

Guide pour créer des pictogrammes de vêtements cohérents pour l'application météo MeteoRenard en utilisant Google Gemini AI et ImageMagick.

## Style Visuel

### Caractéristiques
- **Design minimaliste et épuré**
- **Lignes noires épaisses et claires** sur fond transparent
- **Style flat design** sans gradients ni ombres
- **Apparence vectorielle** avec des contours nets
- **Lisible à petite taille** (adapté pour icônes d'application)
- **Format**: PNG avec transparence (RGBA)
- **Dimensions**: 512x512px

### Principes de Design
1. Contours noirs épais et uniformes
2. Formes simplifiées mais reconnaissables
3. Détails minimaux mais significatifs (boutons, coutures, textures)
4. Proportions équilibrées
5. Fond transparent pour intégration facile

## Processus de Création

### Étape 1: Génération avec Gemini AI

#### Structure du Prompt

Utilisez cette structure pour tous les pictogrammes:

```
A minimalist, clean pictogram icon of [VÊTEMENT]. The design should be simple
and bold with clear black outlines on a white background, suitable for use as
a weather app icon. [DÉTAILS SPÉCIFIQUES AU VÊTEMENT]. Style: flat design,
minimalist icon, vector-like appearance with clean lines and no gradients.
The icon should be easily recognizable at small sizes.
```

#### Commande Gemini

```bash
npm run gemini -- -d ./public/meteo/icons -a 1:1 "[PROMPT]" [nom-fichier]
```

**Paramètres importants:**
- `-d ./public/meteo/icons` : Répertoire de sortie
- `-a 1:1` : Format carré (1024x1024px)
- Nom de fichier sans extension (ex: `manteau-chaud`)

### Étape 2: Post-traitement avec ImageMagick

Après génération, utilisez ImageMagick pour retirer le fond blanc et optimiser le pictogramme:

```bash
cd ./public/meteo/icons

# Étape 1: Retirer le fond blanc et rendre transparent
magick [nom-fichier].png \
  -alpha off -background none -alpha set \
  -fuzz 35% \
  -transparent white \
  [nom-fichier]-transparent.png

# Étape 2: Optimiser la taille et centrer
magick [nom-fichier]-transparent.png \
  -trim +repage \
  -resize 512x512 \
  -gravity center -extent 512x512 \
  -background none \
  -sharpen 0x1 \
  [nom-fichier]-final.png

# Étape 3: Remplacer l'original
mv [nom-fichier]-final.png [nom-fichier].png
rm [nom-fichier]-transparent.png
```

**Ou en une seule commande:**
```bash
magick [nom-fichier].png \
  -alpha off -background none -alpha set \
  -fuzz 35% -transparent white \
  -trim +repage \
  -resize 512x512 \
  -gravity center -extent 512x512 \
  -background none \
  -sharpen 0x1 \
  [nom-fichier]-final.png && \
  mv [nom-fichier]-final.png [nom-fichier].png
```

**Explication des paramètres:**
- `-alpha off -background none -alpha set` : Réinitialise le canal alpha pour forcer la transparence
- `-fuzz 35% -transparent white` : Retire le fond blanc et proche du blanc (tolérance 35%)
- `-trim +repage` : Supprime les marges vides
- `-resize 512x512` : Redimensionne à 512x512px
- `-gravity center -extent 512x512` : Centre l'image dans un canvas 512x512
- `-background none` : Fond transparent
- `-sharpen 0x1` : Améliore la netteté des contours noirs

### Étape 3: Colorisation avec CSS (Automatique)

Les pictogrammes PNG sont automatiquement colorisés en orange (#ff6b00) via CSS filters pour s'adapter au thème de l'application. Aucune étape supplémentaire n'est nécessaire!

**Comment ça fonctionne:**
Le fichier CSS applique automatiquement un filtre qui convertit les contours noirs du pictogramme en couleur orange:

```css
.clothing-icon-img {
  filter: brightness(0) saturate(100%) invert(50%) sepia(98%) saturate(2476%) hue-rotate(2deg) brightness(103%) contrast(101%);
}
```

**Détail du filtre:**
1. `brightness(0)` - Convertit toutes les parties non-transparentes en noir
2. `saturate(100%)` - Prépare la saturation
3. `invert(50%) sepia(98%) saturate(2476%) hue-rotate(2deg)` - Transforme le noir en orange #ff6b00
4. `brightness(103%) contrast(101%)` - Ajustements finaux pour la luminosité

**Avantages:**
- Aucune conversion manuelle nécessaire
- Préserve la transparence du PNG
- Colorisation automatique en orange thème (#ff6b00)
- Fonctionne pour tous les pictogrammes PNG avec fond transparent

## Exemples de Prompts par Catégorie

### Manteaux et Vestes

**Manteau d'hiver (quilté):**
```
A minimalist, clean pictogram icon of a warm winter coat. The design should be
simple and bold with clear black outlines on a white background, suitable for
use as a weather app icon. The coat should have a high collar, visible buttons
down the front, and a slightly puffy quilted texture to indicate warmth. Style:
flat design, minimalist icon, vector-like appearance with clean lines and no
gradients. The icon should be easily recognizable at small sizes.
```

**Manteau léger:**
```
A minimalist pictogram icon of a light jacket. Simple black outlines on white
background. The jacket should have a collar, zipper down the front, and side
pockets. Thin, uninsulated appearance. Style: flat design, clean lines,
minimalist icon suitable for weather app.
```

**Imperméable:**
```
A minimalist pictogram icon of a raincoat. Bold black outlines on white
background. The raincoat should have a hood, water droplet patterns or texture
to indicate waterproof material, and a slightly longer cut. Style: flat design,
simple and recognizable at small sizes.
```

**Coupe-vent:**
```
A minimalist pictogram icon of a windbreaker jacket. Clean black outlines on
white background. Lightweight sporty jacket with a hood, elastic cuffs, and
wind-resistant appearance. Style: flat design, vector-like, minimalist icon.
```

### Accessoires

**Foulard/Écharpe:**
```
A minimalist pictogram icon of a winter scarf. Simple black outlines showing
a scarf wrapped around the neck area with both ends hanging down. Include
subtle fringe details at the ends. Style: flat design, clean lines, easily
recognizable.
```

**Tuque/Bonnet:**
```
A minimalist pictogram icon of a winter beanie hat. Bold black outlines on
white background. Show a knitted beanie with a folded brim and optional pompom
on top. Style: flat design, simple and clear, minimalist icon.
```

**Mitaines/Gants:**
```
A minimalist pictogram icon of winter mittens. Clean black outlines showing a
pair of mittens with visible thumbs. Include subtle texture lines to indicate
knitted material. Style: flat design, vector-like appearance, minimalist.
```

**Casquette:**
```
A minimalist pictogram icon of a baseball cap. Simple black outlines on white
background. Side view showing the curved brim and structured crown. Style:
flat design, clean lines, easily recognizable at small sizes.
```

### Vêtements Principaux

**T-shirt:**
```
A minimalist pictogram icon of a t-shirt. Bold black outlines on white
background. Simple crew neck t-shirt with short sleeves, front view. Style:
flat design, clean lines, minimalist icon for weather app.
```

**Chandail/Pull:**
```
A minimalist pictogram icon of a sweater. Clean black outlines showing a
long-sleeved pullover with crew neck. Include subtle ribbed texture at cuffs
and hem. Style: flat design, vector-like, minimalist and recognizable.
```

**Short:**
```
A minimalist pictogram icon of shorts. Simple black outlines on white
background. Knee-length casual shorts with elastic waistband. Style: flat
design, clean lines, minimalist icon suitable for small sizes.
```

### Chaussures

**Bottes de pluie:**
```
A minimalist pictogram icon of rain boots. Bold black outlines on white
background. Tall waterproof boots with simple design. Style: flat design,
clean lines, minimalist and easily recognizable.
```

**Bottes d'hiver:**
```
A minimalist pictogram icon of winter boots. Clean black outlines showing
insulated boots with visible fur lining at the top. Include texture to
indicate warmth and weatherproofing. Style: flat design, minimalist icon.
```

## Workflow Complet - Exemple

Voici un exemple complet pour créer le pictogramme d'un imperméable:

```bash
# 1. Générer l'image avec Gemini
npm run gemini -- -d ./public/meteo/icons -a 1:1 \
  "A minimalist pictogram icon of a raincoat. Bold black outlines on white background. The raincoat should have a hood, water droplet patterns to indicate waterproof material, and a slightly longer cut. Style: flat design, simple and recognizable at small sizes." \
  imperméable

# 2. Post-traiter avec ImageMagick pour retirer le fond blanc
cd /Users/nicolas/src/betaflag/renard.cool/public/meteo/icons
magick imperméable.png \
  -alpha off -background none -alpha set \
  -fuzz 35% -transparent white \
  -trim +repage \
  -resize 512x512 \
  -gravity center -extent 512x512 \
  -background none \
  -sharpen 0x1 \
  imperméable-final.png

# 3. Remplacer l'original
mv imperméable-final.png imperméable.png

# 4. Vérifier le résultat
file imperméable.png  # Devrait afficher "PNG image data, 512 x 512, 8-bit/color RGBA"
magick imperméable.png -format "%[opaque]" info:  # Devrait afficher "False" (a de la transparence)
ls -lh imperméable.png

# 5. C'est tout! La colorisation en orange sera appliquée automatiquement par CSS
```

## Bonnes Pratiques

### Lors de la Rédaction du Prompt

1. **Soyez spécifique** sur les détails visuels caractéristiques du vêtement
2. **Mentionnez toujours** "minimalist icon", "flat design", "clean lines"
3. **Spécifiez** "black outlines on white background"
4. **Incluez** "suitable for weather app" ou "recognizable at small sizes"
5. **Décrivez les détails importants** (boutons, poches, texture, col, etc.)

### Lors du Post-traitement

1. **Vérifiez la transparence** - Le fond doit être complètement transparent
   ```bash
   # Vérifier avec ImageMagick
   magick [nom-fichier].png -format "%[opaque]" info:
   # Devrait afficher "False" si le fond est transparent
   ```
2. **Contrôlez la taille** - 512x512px est idéal pour les icônes web
3. **Testez la lisibilité** - Réduisez mentalement à 28-64px pour vérifier
4. **Uniformisez le style** - Comparez avec les pictogrammes existants
5. **Testez la colorisation** - Les contours noirs seront automatiquement convertis en orange (#ff6b00)

### Contrôle Qualité

Avant de finaliser un pictogramme, vérifiez:

- [ ] Fond transparent (RGBA)
- [ ] Dimensions: 512x512px
- [ ] Contours noirs nets et uniformes
- [ ] Style cohérent avec les autres pictogrammes
- [ ] Lisible à petite taille (32-64px)
- [ ] Détails significatifs sans surcharge
- [ ] Nom de fichier en français, minuscules, avec tirets

## Nomenclature des Fichiers

Utilisez des noms descriptifs en français:
- `manteau-chaud.png` (pas `winter-coat.png`)
- `imperméable.png` (pas `raincoat.png`)
- `t-shirt.png` (pas `tshirt.png`)
- `bottes-pluie.png` (pas `rain-boots.png`)

Format: tout en minuscules, mots séparés par des tirets.

## Catégories de Vêtements

### Très Froid (< 5°C)
- `manteau-hiver.png`
- `mitaines.png`
- `foulard.png`
- `tuque.png`
- `bottes-hiver.png`

### Froid (5-10°C)
- `manteau-chaud.png`
- `foulard.png`
- `bottes.png`

### Frais (10-15°C)
- `manteau-leger.png`
- `chandail.png`
- `pantalon-long.png`

### Doux (15-20°C)
- `chandail-leger.png`
- `t-shirt-manches-longues.png`
- `pantalon.png`

### Chaud (20-25°C)
- `t-shirt.png`
- `polo.png`
- `pantalon-leger.png`

### Très Chaud (> 25°C)
- `t-shirt-leger.png`
- `short.png`
- `casquette.png`

### Conditions Spéciales
- `imperméable.png` (pluie)
- `bottes-pluie.png` (pluie)
- `coupe-vent.png` (vent)
- `creme-solaire.png` (soleil intense)

## Intégration dans l'Application

Les pictogrammes sont utilisés dans:
- `src/lib/meteo/weather-logic.js` - Fonction `getClothingRecommendations()`
- `src/lib/meteo/dom-updates.js` - Rendu des pictogrammes
- `src/components/meteo/TodayForecast.astro` - Style CSS avec colorisation automatique
- Affichés dans les cartes de période (Matin, Après-midi, Soirée)

Pour ajouter un nouveau pictogramme à l'application:

1. Générer le pictogramme selon ce guide
2. Post-traiter avec ImageMagick pour optimiser le PNG
3. Placer dans `public/meteo/icons/[nom].png`
4. Référencer dans `weather-logic.js` avec le nom de fichier complet (ex: `"manteau-chaud.png"`)

**Colorisation automatique:**
Les pictogrammes PNG sont automatiquement colorisés en orange (#ff6b00) via CSS filters. Aucune étape supplémentaire nécessaire!

**Rendu automatique:**
- Les fichiers `.png` sont affichés avec colorisation orange automatique
- Fallback emoji si aucun pictogramme n'est disponible
- Optimisé pour le thème sombre de l'application

## Outils Requis

- **Node.js** et **npm** (pour le script Gemini)
- **GEMINI_API_KEY** configurée dans `.env`
- **ImageMagick 7+** installé sur le système
  ```bash
  # macOS
  brew install imagemagick

  # Ubuntu/Debian
  sudo apt install imagemagick
  ```

## Dépannage

### Le fond n'est pas transparent
- **Important**: Utilisez `-alpha off -background none -alpha set` avant `-transparent white` pour réinitialiser le canal alpha
- Augmentez la tolérance si nécessaire: utilisez `-fuzz 40%` ou `-fuzz 50%` au lieu de `-fuzz 35%`
- Vérifiez que le format de sortie est bien PNG avec alpha channel (RGBA):
  ```bash
  file [nom-fichier].png  # Devrait afficher "RGBA"
  magick [nom-fichier].png -format "%[opaque]" info:  # Devrait afficher "False"
  ```
- Commande recommandée si le fond reste visible:
  ```bash
  magick [nom-fichier].png -alpha off -background none -alpha set -fuzz 35% -transparent white temp.png
  magick temp.png -trim +repage -resize 512x512 -gravity center -extent 512x512 -background none [nom-fichier].png
  rm temp.png
  ```

### L'image est trop petite/grande
- Ajustez `-resize 512x512` à la taille souhaitée
- Gardez toujours un format carré

### Les contours sont flous
- Augmentez `-sharpen 0x2` pour plus de netteté
- Ou utilisez `-unsharp 0x1` pour un contrôle plus fin

### Le style ne correspond pas
- Révisez le prompt pour insister sur "minimalist" et "flat design"
- Ajoutez "no gradients, no shadows, no 3D effects"

## Ressources

- [Documentation Gemini CLI](../bin/gemini.ts)
- [ImageMagick Documentation](https://imagemagick.org/script/command-line-processing.php)
- [Guide Images Recettes](./guide-images-recettes.md) (pour référence de style)

---

**Version:** 1.0
**Date:** 21 octobre 2025
**Auteur:** Claude Code
**Projet:** MeteoRenard - renard.cool
