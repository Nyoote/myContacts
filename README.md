# myContacts

Application de gestion de contacts (client + serveur)

---

## 1. À propos

`myContacts` est une application fullstack pour gérer des contacts : le client (frontend) interagit avec un serveur (
backend) pour lister, créer, modifier ou supprimer des contacts.

---

## 2. Structure du projet 

```
myContacts/
├── client/ # Frontend React avec Material UI
└── server/ # Backend Express connecté à MongoDB
```
---
## 3. Technologies

Voici les principales technologies / frameworks utilisés :

- Frontend (client) : [React](https://fr.react.dev/)
- Librairie Frontend : [Material UI](https://mui.com/material-ui/getting-started/)
- Backend (serveur) : [Node.js](https://nodejs.org/fr) + [Express](https://expressjs.com/)
- Base de données : [MongoDB](https://www.mongodb.com/) + [Mongoose](https://www.npmjs.com/package/mongoose)
- Authentification : [JWT](https://www.jwt.io/) + [bcrypt](https://www.npmjs.com/package/bcryptjs)

---

## 4. Prérequis

Avant de lancer l’application, assure-toi d’avoir :

- [Node.js](https://nodejs.org/fr) (min version 22)
- [npm](https://www.npmjs.com/)
- Une instance [MongoDB](https://www.mongodb.com/atlas/database) opérationnelle
- [nodemon](https://www.npmjs.com/package/nodemon)

---

## 5. Installation / Setup

Voici les étapes pour installer et lancer le projet :

```bash
# Cloner le dépôt
git clone https://github.com/Nyoote/myContacts.git
cd myContacts

# Installer le backend
cd server
npm install

# Installer le frontend
cd ../client
npm install
```
---

## 6. Variables d’environnement

Il faut définir les variables d’environnement nécessaires (fichier .env ou autre). Par exemple :

```bash
# dans /server/.env
MONGO_URI="url_db"
DB_NAME="db_name"
PORT="port"
JWT_SECRET_KEY="secret_key"
FRONT_URL="front_url"
```

```bash
# dans /client/.env
VITE_API_URI="url_api"
```

## 7. Démarrage / scripts

| Commande         | Description                                          |
|------------------|------------------------------------------------------|
| `node server.js` | Lance le serveur Express sur le port défini          |
| `npm run dev`    | Lance le serveur en mode développement (auto-reload) |
| `npm run test`   | Exécute la suite de tests Jest depuis /server        |

```bash
# dans un terminal
cd server
nodemon server.js

# dans un autre terminal
cd client
npm run dev
```
```bash
# pour executer les tests
cd server
npm run test
```
---
## 8. Endpoints API

> Base URL dev : `http://localhost:3000`  
> Les routes concernant **Contacts** sont protégées par JWT → Header `Authorization: Bearer <token>`

### Public

#### Racine (ping)
| Méthode | Chemin | Auth | Body | Succès | Erreurs |
|---|---|---|---|---|---|
| GET | `/` | Non | — | **200** → `"Hello World!"` | — |

---

### Authentification

#### Inscription
| Méthode | Chemin | Auth | Body (JSON) | Succès | Erreurs                                                                                               |
|---|---|---|---|---|-------------------------------------------------------------------------------------------------------|
| POST | `/auth/register` | Non | `{ "username": "alice", "email": "alice@test.com", "password": "Strong#123" }` | **201** → `{ "message": "User created successfully" }` | **409** (doublon) → `{ "field":"email"/"username", "error":"..." }` ; **400** → `{ "message":"..." }` |

#### Connexion
| Méthode | Chemin | Auth | Body (JSON) | Succès | Erreurs |
|---|---|---|---|---|---|
| POST | `/auth/login` | Non | `{ "email": "alice@test.com", "password": "Strong#123" }` | **200** → `{ "message":"Login successful", "token":"<JWT>" }` | **401** → `{ "error":"Invalid email or password" }` ; **500** → `{ "message":"..." }` |

---

### Utilisateur (partiellement protégé)

#### Profil courant
| Méthode | Chemin | Auth | Body | Succès | Erreurs |
|---|---|---|---|---|---|
| GET | `/api/me` | **Oui (Bearer)** | — | **200** → `{ "id":"...", "username":"...", "email":"..." }` | **401** → `{ "message":"Unauthorized" }` |

#### Liste des utilisateurs
| Méthode | Chemin | Auth | Body | Succès | Erreurs |
|---|---|------|---|---|---|
| GET | `/api/users` | non  | — | **200** → `[ { "_id":"...", "username":"...", "email":"..." }, ... ]` | **404** → `{ "message":"Error, cannot find users" }` |

---

### Contacts (protégé)

#### Lister les contacts
| Méthode | Chemin | Auth | Body | Succès                                                                                                                                 | Erreurs |
|---|---|---|---|----------------------------------------------------------------------------------------------------------------------------------------|---|
| GET | `/api/getContacts` | **Oui (Bearer)** | — | **200** → `[ { "_id":"...", "user":"...", "firstName":"...", "lastName":"...", "phone":"...", "createdAt":"...", "updatedAt":"..." } ]` | **401** → `{ "message":"Unauthorized" }` ; **404** → `{ "message":"Error, cannot find contacts" }` |

#### Créer un contact
| Méthode | Chemin | Auth | Body (JSON) | Succès | Erreurs |
|---|---|---|---|---|---|
| POST | `/api/addContact` | **Oui (Bearer)** | `{ "firstName":"Alice", "lastName":"Martin", "phone":"0612345678" }` | **201** → `{ "message":"Contact created successfully" }` | **409** (doublon) → `{ "field":"phone", "error":"Contact already exists" }` ; **400** → `{ "message":"..." }` |

#### Mettre à jour un contact
| Méthode | Chemin | Auth | Body (JSON) | Succès | Erreurs |
|---|---|---|---|---|---|
| PATCH | `/api/updateContact/:id` | **Oui (Bearer)** | Champs optionnels : `{ "firstName":"...", "lastName":"...", "phone":"..." }` | **200** → `{ "message":"Contact updated successfully", "contact":{...} }` | **404** → `{ "message":"Contact not found" }` ; **409** → `{ "field":"phone", "error":"Phone number already in use" }` ; **500** → `{ "message":"Error updating contact", "error":"..." }` |

#### Supprimer un contact
| Méthode | Chemin | Auth | Body | Succès | Erreurs |
|---|---|---|---|---|---|
| DELETE | `/api/deleteContact/:id` | **Oui (Bearer)** | — | **200** → `{ "message":"Contact deleted successfully", "contact":{...} }` | **404** → `{ "message":"Contact not found" }` ; **500** → `{ "message":"Error deleting contact", "error":"..." }` |

---

### Récapitulatif d’usage JWT
1) `POST /auth/register` → créer un compte
2) `POST /auth/login` → récupérer `token`
3) Ajouter `Authorization: Bearer <token>` sur les routes concernant `Contacts`

---
## 9. Comptes de test / Identifiants

Chaque utilisateur doit créer son propre compte pour tester l’application.  
Aucune base de données partagée ni compte par défaut n’est fourni.

### Étapes pour créer un utilisateur de test

1. **Inscription**
    - Envoie une requête `POST` vers `/auth/register`
    - Exemple :
      ```json
      {
        "username": "monuser",
        "email": "monuser@gmail.com",
        "password": "Strong#123"
      }
      ```
    - Si tout se passe bien → réponse :
      ```json
      { "message": "User created successfully" }
      ```

2. **Connexion**
    - Envoie une requête `POST` vers `/auth/login`
    - Exemple :
      ```json
      {
        "email": "monuser@gmail.com",
        "password": "Strong#123"
      }
      ```
    - Si les identifiants sont valides → réponse :
      ```json
      {
        "message": "Login successful",
        "token": "<JWT>"
      }
      ```

3. **Utilisation du token**
    - Copie le champ `"token"` et ajoute-le dans le header de tes requêtes :
      ```
      Authorization: Bearer <token>
      ```
    - Cela te permettra d’accéder aux routes protégées (`/api/*`).

---
 **Astuce :**  
 Tu peux facilement tester ces endpoints avec [Postman](https://www.postman.com/)
---
## 10. Liens

* L'API sera disponible sur [http://localhost:3000](http://localhost:3000)
* La doc Swagger sera disponible sur [http://localhost:3000/api-doc](http://localhost:3000/api-doc)
* Back déployé [https://mycontacts-o1ko.onrender.com](https://mycontacts-o1ko.onrender.com)
* Front déployé [https://mycontacts-frontend-ohmg.onrender.com](https://mycontacts-frontend-ohmg.onrender.com)
