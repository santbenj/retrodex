Ce projet est un rétrodex 1G regroupant tous les Pokémons de la 1ére génération avec leurs images, statistiques et types d'origine. 
On peut aussi créer son propre Pokémon dans le style 1G avec des sprites de Pokémons bug ou modifié un Pokémon importé, on peut aussi supprimer les Pokémons que ce soit les importé ou les créés. 

Le projet utilise API Plateform pour le back-end et Next.js Tailwind CSS pour le front-end, pour le lancer il suffit de lancer : 


```
docker compose up -d --wait
```

Puis dans votre navigateur, allez sur https://localhost pour accéder à l'application. 

# Fonctionnement générale 

Le projet lance une page d'accueil, dans cette page d'accueil il y a un bouton pour importer les 151 premiers Pokémons. Une fois les 151 Pokémons importé vous serez envoyé vers le rétrodex regroupant tous les pokémons importés puis les pokémons que vous avez créé ou modifiées, vous pouvez modifier les Pokémons du retrodex,le voir plus en détails voir le supprimer si vous le souhaiter
Il y a une page de création permettant de créer son propre Pokémon avec tous les champs disponibles et des images à disposition, il y a une image par défaut si rien n'est choisi. 

Beaucoup des données sont extraite de la PokéAPI comme les types, les images sauf celle des Pokémons bug, le nom, les description, le poids et la taille.
Tout ce qui est statistiques vient d'un fichier json intégré dans le projet,il se trouve dans /pwa/public/stat_pokemons_1G.json
Je tiens à préciser que les images sont des liens vers le dépot github des images de PokéAPI.

Ce projet est une première version qui est voué à être améliorer à l'avenir, changez bien la configuration serveur/base de donnée si vous voulez vous en servir ailleurs que dans un environnement de développement. 

# Outlils utilisé: 

pokéAPI: https://pokeapi.co/?ref=public-apis
Api Plateform for symfony/ outils nextjs:https://api-platform.com/docs/symfony/
Tailwind: https://tailwindcss.com/
Docker: https://www.docker.com/



