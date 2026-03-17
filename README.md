# Guide d'installation et de lancement du projet

## Installer SurrealDB :
1 - installer SurrealDB avec ```iwr https://windows.surrealdb.com -useb | iex```.

2 - Vérifier l'installation en tappant ```surreal version``` dans le terminal.
<br> Vous devriez avoir ```3.0.0 for windows on x86_64```.

3 - Si l'applet ```surreal``` n'est pas reconnu, essayez de rajouter ```C:\Users\[user]\AppData\Local\SurrealDB\surreal.exe``` à votre PATH.

## Lancer SurrealDB
```surreal start --log trace --user root --pass root memory```

À noter que la mémoire de la db n'est pas persistante et se vide entre chaque lancement. C'est volontaire.

## Définir et peupler la base de données
Une fois que la bdd est lancée, dans un autre terminal, lancer la commande suivante
``` bash
Get-Content SQL/init.surql -Raw | surreal sql `
    --endpoint http://127.0.0.1:8000 `
    --username root `
    --password root `
    --namespace minicraig_list `
    --database all `
    --multi
```

## Lancer Next
Une fois la bdd lancée, définie et peuplée, dans un autre terminal, lancer
```bash
npm run dev
```
Vous pouvez ensuite vous rendre sur http://localhost:3000 pour tester l'application

## Authentification
Vous pouvez créer votre propre profil ou vous connecter avec un des profils placeholder dont vous pouvez trouver les identifiants dans ```SQL/init.surql```.