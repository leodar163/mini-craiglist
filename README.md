# Guide d'installation et de lancement du projet

## Installer SurrealDB :
1 - installer SurrealDB avec ```iwr https://windows.surrealdb.com -useb | iex```.

2 - Vérifier l'installation en tappant ```surreal version``` dans le terminal.
<br> Vous devriez avoir ```3.0.0 for windows on x86_64```.

3 - Si l'applet ```surreal``` n'est pas reconnu, essayez de rajouter ```C:\Users\[user]\AppData\Local\SurrealDB\surreal.exe``` à votre PATH.

## Lancer SurrealDB
```surreal start --log trace --user root --pass root memory```

À noter que la mémoire de la db n'est pas persistante et se vide entre chaque lancement. C'est volontaire.

## Lancer Next
```bash
npm run dev
```
Vous pouvez ensuite vous rendre sur http://localhost:3000 pour tester l'application