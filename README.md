# 🎬 Film API – Express, Knex & SQLite

## Présentation

Ce projet fournit une API backend pour la gestion de films et d'utilisateurs, développée avec Node.js, Express, Knex.js et SQLite. Elle couvre :

-   Authentification (inscription, connexion, déconnexion)
-   Gestion des films (CRUD)
-   Évaluations des films (notation, commentaires, statistiques, top)
-   Gestion des utilisateurs (CRUD, admin)
-   Migrations automatiques (création des tables à la volée)

---

## 🏗️ Structure du projet

```
/                   # Racine
|-- src/
|   |-- controller/    # Logique métiers (user, movie, auth)
|   |-- router/        # Fichiers de routes Express
|   |-- middleware/    # Authentification & autorisation
|   |-- service/       # Accès BDD via Knex
|   |-- config/        # Fichier de configuration (port, etc)
|   |-- data/          # db.js (connexion & migration)
|
|-- index.js           # Entrée principale Express
|-- package.json
|-- README.md
```

---

## ⚡️ Installation & démarrage

1. **Installer les dépendances :**
    ```bash
    npm install
    ```

````

2. **Lancer le serveur :**
    ```bash
    node index.js
    ```
    ou avec nodemon :
    ```bash
    npx nodemon index.js
    ```
3. **La première exécution crée toutes les tables nécessaires (aucune action manuelle requise).**

---

## 🔑 Principales routes de l’API

-   **/auth/** → Inscription, connexion, logout
-   **/movies/** → CRUD films + évaluations (notation, top, stats)
-   **/users/** → Gestion utilisateurs (CRUD, admin)

Utilise un outil comme [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/) pour tester les endpoints.

---

## Initialisation de la base de données

```bash
node ./src/data/migrate.js
```
---

## 🗄️ Schéma minimal des tables (Knex)

### users

-   id (INTEGER, clé primaire)
-   email (TEXT, unique)
-   password_hash (TEXT)
-   username (TEXT, optionnel)

### movies

-   id (INTEGER, clé primaire)
-   title (TEXT)
-   genre (TEXT)
-   synopsis (TEXT)
-   poster_url (TEXT)
-   year (INTEGER)

### movie_evaluations

-   id (INTEGER, clé primaire)
-   user_id (INTEGER, FK users)
-   movie_id (INTEGER, FK movies)
-   rating (INTEGER 1-5)
-   comment (TEXT)
-   created_at, updated_at (DATETIME)

---

## 🔒 Sécurité

-   Les mots de passe sont hashés (jamais stockés en clair)
-   Authentification JWT recommandée pour protéger les routes (voir `/middleware/authentification.js`)
-   Certaines routes sont réservées aux admins (à adapter selon projet)

---

## 🛠️ Personnalisation

-   Ajoute tes propres colonnes, tables ou services selon tes besoins (tags, favoris, recommandations avancées…)
-   Tu veux un script de seed ? Demande !

---

## 🤝 Contribution & aide

-   Fork, PR et suggestions bienvenues !
-   Pour toute question ou bug, ouvre une issue.

---

Bonne API 🎬
````
