# Guide d'installation et de lancement du projet

## Installer SurrealDB :
1 - Télécharger [l'exécutable de SurrealDb version 2.6.2](https://github.com/surrealdb/surrealdb/releases/tag/v2.6.2) (le SDK JS n'est pas encore compatible avec la version 3.0.0).
<br> Vous pouvez le mettre n'importe où dans vos dossiers. 

2 - Renommer l'executable en surreal.exe

3 - Ajouter l'executable aux variables d'environnement et relancer le terminal

4 - Vérifier l'installation en tappant <code>surreal version</code> dans le terminal
<br> Vous devriez avoir 2.6.2 for [windows/linux/darwin] on x86_64

## Lancer SurrealDB
<code>surreal start --log trace --user root --pass root memory</code>

A noter que la mémoire de la db n'est pas persistante et se vide entre chaque lancement. C'est volontaire.

## Lancer Next
```bash
npm run dev
```
Vous pouvez ensuite vous rendre sur http://localhost:3000 pour tester l'application