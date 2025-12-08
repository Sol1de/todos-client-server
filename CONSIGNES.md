# Todo List

Vous allez reprendre une application "Todo List" (client + server) existante.  
Votre mission est de la doter d'une pipeline CI/CD complète et sécurisée.

[Voici le lien du repo de base](https://github.com/Punkte/todos-client-server)

## Fonctionnalités attendues

### Pipeline CI/CD

Configurez une pipeline CI/CD complète (GitHub Actions ou GitLab CI) pour tester, packager et déployer l'application.
Pour la CI/CD il faudra *a minima* les jobs/concepts suivants:

- **Qualité**
    - Un job `test-unit` pour le **backend**. (Vous devrez ajouter au moins 2 tests unitaires sur les routes de l'API).
    - Un job `lint-commits` qui vérifie que les messages de commits de la PR respectent les **Conventional Commits** avant de pouvoir merger.
    - Un job `coverage` qui récupère un artéfact du job de test et s'assure que la couverture de test est suffisante, celui ci ne se lance que sur les PR.

- **Packaging (Docker) :**
    - Un `Dockerfile` **multi-stage** pour le **backend** Node/Express.
    - Un job build-docker qui construit l'image (sans la "pousser") sur les PR (pour permettre le scan de sécurité).
        - Ce même job (build-docker) devra aussi s'exécuter sur les tags pour construire ET pousser l'image versionnée.

- **Sécurité (DevSecOps) :**
    - Un job `security-scan-npm` qui lance `npm audit --audit-level=high` (pour le client ET le server).
    - Un job `security-scan-docker` qui utilise **Trivy** (ou un équivalent) pour scanner votre image Docker *après* le build uniquement sur les PR. La pipeline doit échouer si des failles critiques sont trouvées.


- **Déploiement & Release :**
    - Le déploiement en production (frontend + backend) ne doit se déclencher **QUE** lors de la création d'un **tag Git** (ex: `v1.0.0`).
    - L'image Docker poussée sur Docker Hub DOIT être taguée avec la version du tag Git (ex: `mon-user/todo-api:v1.0.0`).
    - Un job `deploy-frontend` qui déploie le client (sur Vercel, Netlify... choix libre).
    - Un job `deploy-backend` qui déploie l'image Docker *versionnée* sur **Render**.
    - Un job `smoke-test` doit valider que le déploiement a réussi *après* coup.

Configuration des secrets : Utilisez les secrets GitHub/GitLab pour tous les tokens (`DOCKER_USERNAME`, `DOCKERHUB_TOKEN`, `RENDER_DEPLOY_HOOK`, etc.).
Ceux-ci ne doivent pas être visibles dans le code source.


### Observabilité

- Votre application doit être capable de reporter ses propres erreurs.
- **Tâche :** Implémentez **Sentry** sur le **backend** node.
- **Validation :** Vous devez créer une route de test (ex: `GET /fail`) qui génère une erreur intentionnelle et prouver (screenshot le `README.md`) que l'erreur est bien capturée dans votre dashboard Sentry.

#### Bonus

Ajouter du profiling

### Notifications

- **Objectif :** La pipeline doit vous notifier de son **succès** ou de son **échec** sur Slack ou Discord ou autre.
- Créez un **Webhook entrant** sur un serveur Discord (c'est le plus simple et gratuit) ou Slack.
- Stockez l'URL du webhook dans les `Secrets` de GitHub.
- Ajoutez un nouveau job `notify` (ou des étapes conditionnelles) qui envoie un message :
    - Si la pipeline réussit (`if: success()`), envoyez un message de succès (ex: "✅ Déploiement v1.0.1 OK").
    - Si la pipeline échoue (`if: failure()`), envoyez un message d'échec (ex: "❌ BUILD CASSÉ sur v1.0.1").

Cette partie là sera évaluée pendant le cours, appelez moi quand c'est fait.

### Historique Git

Conventional Commits : Respectez les conventions de commit pour toute modification.
Il faudra que votre historique git soit clair.
Utilisez le workflow des Pull Requests / Merge Request (en gros ne poussez rien sur main comme des sauvages).

### Modalités de rendu

Repo Git : Ne faites pas de Fork. Clonez le repo de base et créez votre *propre* repo sur GitHub ou GitLab.
Droits d'accès : Ajoutez le compte [@punkte (pour Github)](https://github.com/Punkte) ou [@teepan (pour Gitlab)](https://gitlab.com/teepan) comme collaborateur sur le repo pour la correction.

### Évaluation

La notation tiendra compte :

- la structure des commits,
- le bon fonctionnement de la pipeline CI/CD complète,
- l'implémentation correcte des tests (Unit), du `Dockerfile` multi-stage et du scan de sécurité,
- la robustesse de la stratégie de déploiement (sur tag, versionnée).
- la mise en place d'un système de notification

Veuillez inclure un fichier `README.md` à la racine de votre projet pour faciliter l'évaluation.
Ce fichier doit contenir :

- Nom et prénom des membres du groupe sous forme de tableau

|NOM|Prénom|
|---|------|
|DOE|John  |
|DOE|Jane  |

- Une brève explication de l'architecture et des choix techniques, y compris les étapes d'installation pour exécuter et tester le projet en local.
- Les instructions ET les **URLs** pour accéder au **frontend ET au backend** déployés.
- Toute information nécessaire pour comprendre la configuration de la pipeline CI/CD, notamment les différents jobs et la stratégie de déploiement.
- Une section expliquant votre **stratégie de rollback**. (Comment feriez-vous pour redéployer la version `v1.0.1` si la `v1.0.2` que vous venez de pousser est buggée ? Votre stratégie de *tagging* d'image est la clé ici).

Un README clair et détaillé permettra de me faciliter le travail pour que je puisse vous noter et vérifier votre travail et votre organisation.

Pensez à mettre votre repo en privé.

Bon chance 🗿