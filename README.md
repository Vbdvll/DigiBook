# DigiBook

Site vitrine pour vendre des packs de livres PDF avec commande via WhatsApp.

## Ouvrir le site

- Page client: `index.html`
- Page admin: `gestion-dbk-7x4.html`

Tu peux aussi lancer un serveur local dans ce dossier:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Puis ouvrir:

```text
http://127.0.0.1:4173
```

## Modifier les packs

Va sur `gestion-dbk-7x4.html`, puis tu peux:

- changer le nom du site;
- mettre ton numéro WhatsApp au format international, par exemple `243900000000`;
- changer la devise;
- ajouter, supprimer ou modifier les packs;
- activer ou desactiver l'affichage d'un pack sur le site public;
- ajouter, supprimer ou modifier les livres;
- exporter/importer le catalogue en JSON.

La page admin n'est pas affichee dans la navigation du site public. Ouvre
directement `gestion-dbk-7x4.html` quand tu veux modifier le catalogue.

Le catalogue public a ete construit a partir des PDF trouves dans
`D:\book for sale\`. La page client affiche maintenant une liste filtrable avec
recherche, categories et compteur de resultats.

La source officielle actuelle est `D:\book for sale\Fore sale`, qui contient
100 PDF. Dans la page de gestion, le bouton `Charger les 100 livres` remplace le
catalogue courant par cette selection, active le pack 100 et synchronise le tout
avec Supabase.

Les changements de l'admin sont enregistrés dans le navigateur avec `localStorage`.
Pour un vrai admin en ligne qui modifie le site pour tous les visiteurs, il faudra ajouter un backend ou connecter une base de données.

## Deploiement freemium

Options recommandees:

- GitHub Pages: gratuit, simple, bon pour une premiere mise en ligne.
- Netlify: gratuit, tres pratique si tu veux deployer par glisser-deposer ou via GitHub.
- Vercel: gratuit, propre aussi pour site statique.

La page de gestion est masquee de la navigation publique et protegee par
Supabase Auth quand la configuration Supabase est active. Garder une URL peu
evidente reduit l'exposition, mais la vraie protection reste la connexion admin
et les politiques RLS.

## Supabase admin

Supabase est prevu pour l'authentification admin et la sauvegarde du catalogue.

1. Cree un projet sur Supabase.
2. Va dans `SQL Editor`.
3. Execute le contenu de `supabase-schema.sql`.
4. Va dans `Authentication > Users` et cree ton utilisateur admin.
5. Copie l'UUID de cet utilisateur.
6. Dans `SQL Editor`, execute:

```sql
insert into public.admin_users (user_id)
values ('TON_UUID_UTILISATEUR');
```

7. Va dans `Project Settings > API`.
8. Copie `Project URL` et `anon public key`.
9. Mets ces valeurs dans `supabase-config.js`.

Une fois configure, `gestion-dbk-7x4.html` affiche une connexion email/mot de passe et les
modifications sont sauvegardees dans Supabase. Sans configuration Supabase, le
site garde le mode local avec `localStorage`.
