# <a name="structure"></a> Structure

Par défaut, Vite crée un projet React avec une structure minimale. Cependant, au cours de cette formation, nous allons améliorer cette structure en ajoutant d'autres sous-dossiers à l'intérieur du dossier "src". Voici à quoi ressemble la structure du projet :

<pre>
📂 node_modules
📂 public
|  └── favicon.ico 
|  └── logo.png
📂 src
|  └── 📂 assets
|  └── 📂 app
|      └── 📂 components
|      └── 📂 constants
|      └── 📂 helpers
|      └── 📂 hooks
|      └── 📂 utils
|      └── 📂 styles
|  └──📂 modules
│     └── 📂 utilisateurs
│         └── ListeUtilisateursPage.jsx
|         └── UtilisateursRoutes.jsx
|         └── utilisateursApi.js
|         └── utilisateurSchema.js  
|         └── index.js
📂 config
|  📂 lang
📂 store
App.css
App.jsx
index.css
main.jsx
.eslintrc.cjs
.gitignore
package-lock.json
package.json
vite.config.js
  </pre>

Voici une description détaillée de chaque répertoire et fichier :

- `node_modules/`: Dossier où les dépendances de votre projet sont installées par npm.
- `public/`: Répertoire des ressources statiques accessibles publiquement
- `src/` : Répertoire des sources de l'application React
  - `app/`
    - `components/` : Composants réutilisables de l'application
    - `constants/`: Dossier contenant des fichiers définissant des constantes pour l'application.
    - `hooks/`: Utilisé pour regrouper des hooks personnalisés dans une application React
    - `utils/`: Dossier qui contient des utilitaires, par exemple, des fonctions ou des configurations réutilisables.
  - modules : Contient tous les dossiers y compris les fichiers des domaines de l'application.
- `assets/` : Utilisé dans les projets pour stocker des fichiers statiques tels que des images, des polices, des vidéos, des fichiers audio, des icônes, etc.
- `config`:
    - `lang/`: Utilisé pour stocker des fichiers de traduction
- `store/`: Utilisé pour regrouper la logique liée à la gestion de l'état global de l'application (redux)
- `styles/`: Utilisé pour stocker les fichiers de styles CSS ou Sass (ou d'autres préprocesseurs CSS)
- `main.js`: Ce fichier est généralement le point d'entrée JavaScript de votre application React
- `App.jsx`: Ce fichier est généralement le composant principal de votre application React
- `.eslintrc.cjs`: Fichier de configuration ESLint au format CommonJS utilisé pour détecter et signaler les erreurs de syntaxe
- `.gitignore`: Fichier spécifiant les fichiers et répertoires à ignorer lors de la gestion de version avec Git.
- `index.html`: Ce fichier est le fichier principal de votre application web. Il est chargé par le navigateur lorsqu'un utilisateur visite votre site web et sert de point de départ pour votre application React.
- `package-lock.json`: Fichier généré par npm pour fixer les versions exactes des dépendances.
- `package.json`: Fichier de configuration de Node.js listant les métadonnées du projet et les dépendances.
- `vite.config.js`: Ce fichier permet de configurer Vite pour personnaliser le processus de construction du projet

# Liste de dépendances

Voici la liste des dépendances qui viennent préinstallées par défaut. Assurez-vous de garder celles que vous utilisez et désinstallez celles dont vous pensez que vous n'aurez pas besoin.

|           Dépendance            |                        Description                        |
| :-----------------------------: | :-------------------------------------------------------: |
|    mapbox-gl & react-map-gl     |              Pour utiliser mapbox sur react               |
|           redux-react           |                 Creer un etat centralise                  |
|           highcharts            |            Afficher les donnees les graphiques            |
|             pdf-lib             |                 Generer des documents PDF                 |
| react-infinite-scroll-component |          Creation d'une liste infinie au scroll           |
|           react-intl            |                Pour l'internationalisation                |
|       react-lottie-player       |       Pour afficher les animations au format lottie       |
|             moment              |                  Manipulation des dates                   |
|      react-top-loading-bar      | Pour afficher un loading de chargement de la page en haut |
|        socket.io-client         |          Effectuer des evenements en temps reel           |
|              xlsx               |                Generer des fichiers excel                 |
|             pdfkit              |                 Generer des fichiers pdf                  |
|              zego               |                   Effectuer des appels                    |

# Règles a suivre

## Application

`Règle 1` : Il est strictement interdit de modifier la structure du projet, les fonctions ou classes prédéfinies de base, sauf s'il existe une raison valable et validée par la direction technique.

`Règle 2` : Avant d'ajouter un module, assurez-vous qu'il n'existe pas déjà un module défini répondant au même besoin.

`Règle 3` : Avant d'ajouter une fonction, assurez-vous qu'il n'existe pas déjà une fonction réalisant la même tâche.

`Règle 4` : Valider les formulaires par des bibliothèques robustes et bien testées comme yup, zod etc.

`Règle 5` : Ecrire les schémas de validation dans son propre fichier pour faciliter la réutilisabilité et la séparation des préocupations.

`Règle 6` : Traduire les messages d'erreur de validation des données.

`Règle 7` : Évitez d'encombrer la page : Décomposer-la dans des différents composants indépendants, Opter pour des composants courts et maintenables

## Nomenclature des fichiers

`Règle 8` : Le nom d'un fichier contenant une classe doit commencer par une lettre majuscule

`Règle 9` : Le nom de fichier d'un composant doit commencer par la lettre majuscules et correspondre au nom de la fonction du composant auquel il est associé.

`Règle 10` : Le nom du fichier représentant une page doit être en CamelCase et se terminer par le suffixe `Page`.

```js
✅ ListeArticlesPage.js
❌ listeArticlespage.js
❌ listeArticles_page.js
```
## Contribution

### Lancer les tests localement

Pour lancer les test unitaires on utilise jest en executant cette commande:

```
npm run test
```

### Formatage du code source

Nous utilisons <a href="https://prettier.io/">Prettier</a> pour formater le code source

Vous pouvez formater automatiquement votre code en exécutant :

```
npx prettier . --write
```

### Linting/verifying votre code

Vous pouvez vérifier que votre code est correctement formaté et respecte le style de codage en exécutant :

```
npm run lint
```

### Guide des messages de commit

Nous avons des règles très précises sur la façon dont nos messages de commit Git doivent être formatés. Cela permet d'avoir des messages plus lisibles et faciles à suivre lors de l'exploration de l'historique du projet. Vous trouverez plus de détails sur ces règles <a href="https://gist.github.com/pmutua/7008c22908f89eb8bd21b36e4f92b04f">ici</a>

Voici le format d'un message de commit:

```
<type>(<scope>): <subject>
```

#### Type

Doit être l'un des suivants :

- build : Modifications affectant le système de build ou les dépendances externes (exemples de scopes : gulp, broccoli, npm).
- ci : Modifications des fichiers de configuration et scripts de l'intégration continue (exemples de scopes : Circle, BrowserStack, SauceLabs).
- docs : Modifications concernant uniquement la documentation.
- feat : Ajout d'une nouvelle fonctionnalité.
- fix : Correction d'un bug.
- perf : Modification du code visant à améliorer les performances.
- refactor : Modification du code qui ne corrige pas un bug et n'ajoute pas de nouvelle fonctionnalité.
- style : Modifications qui n'affectent pas le fonctionnement du code (espaces, formatage, points-virgules manquants, etc.).
- test : Ajout ou correction de tests existants.

#### scope

Scope est un module

#### subject

Le sujet contient une description succincte de la modification :

- Utilisez l'impératif au présent : "changer" et non "J'ai changeé" ou "les echanges".
- Ne mettez pas de majuscule à la première lettre.
- Ne terminez pas par un point (.).

Examples:

- ✅ feat(auth): ajouter la route pour reinitialiser le mot de passe
- ✅ fix(dashboard): corriger le probleme des donnees non correspondantes
- ✅ refactory(ihm): enlever les commentaires unitiles
