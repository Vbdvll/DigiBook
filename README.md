# DigiBook

Site vitrine pour vendre des packs de livres PDF avec commande via WhatsApp.

## Ouvrir le site

- Page client: `index.html`
- Page admin: `admin.html`

Tu peux aussi lancer un serveur local dans ce dossier:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Puis ouvrir:

```text
http://127.0.0.1:4173
```

## Modifier les packs

Va sur `admin.html`, puis tu peux:

- changer le nom du site;
- mettre ton numéro WhatsApp au format international, par exemple `243900000000`;
- changer la devise;
- ajouter, supprimer ou modifier les packs;
- activer ou desactiver l'affichage d'un pack sur le site public;
- ajouter, supprimer ou modifier les livres;
- exporter/importer le catalogue en JSON.

La page admin n'est pas affichee dans la navigation du site public. Ouvre
directement `admin.html` quand tu veux modifier le catalogue.

Le catalogue public a ete construit a partir des PDF trouves dans
`D:\book for sale\`. La page client affiche maintenant une liste filtrable avec
recherche, categories et compteur de resultats.

Les changements de l'admin sont enregistrés dans le navigateur avec `localStorage`.
Pour un vrai admin en ligne qui modifie le site pour tous les visiteurs, il faudra ajouter un backend ou connecter une base de données.

## Deploiement freemium

Options recommandees:

- GitHub Pages: gratuit, simple, bon pour une premiere mise en ligne.
- Netlify: gratuit, tres pratique si tu veux deployer par glisser-deposer ou via GitHub.
- Vercel: gratuit, propre aussi pour site statique.

Ce site est statique. `admin.html` est masque de la navigation publique, mais
il n'est pas protege par mot de passe dans cette version. Pour un vrai espace
admin securise en ligne, il faudra ajouter une authentification ou passer par un
backend.
