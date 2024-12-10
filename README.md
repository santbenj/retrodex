# Rétrodex 1G

Ce projet est un rétrodex de la première génération regroupant tous les Pokémon de cette génération, avec leurs images, statistiques et types d'origine. 

## Fonctionnalités

- **Création de Pokémon** : Vous pouvez créer votre propre Pokémon dans le style de la première génération en utilisant des sprites de Pokémon bug. Il est également possible de modifier un Pokémon importé ou de supprimer des Pokémon, qu'ils soient importés ou créés.

## Technologies utilisées

Le projet utilise **API Platform** pour le back-end et **Next.js** avec **Tailwind CSS** pour le front-end. Pour lancer l'application, exécutez la commande suivante :

```
docker compose up -d --wait
```

Ensuite, ouvrez votre navigateur et accédez à https://localhost pour accéder à l'application.

## Fonctionnement général

À l'ouverture de l'application, vous serez accueilli par une page d'accueil contenant un bouton pour importer les 151 premiers Pokémon. Une fois l'importation terminée, vous serez redirigé vers le rétrodex, qui regroupe tous les Pokémon importés ainsi que ceux que vous avez créés ou modifiés.

Vous pouvez modifier les Pokémon du rétrodex, consulter leurs détails et les supprimer si vous le souhaitez. Une page de création est également disponible, vous permettant de créer votre propre Pokémon avec tous les champs nécessaires et des images à disposition. Une image par défaut est fournie si aucune image n'est choisie.

La plupart des données proviennent de la PokéAPI, y compris les types et les images (à l'exception des images des Pokémon bug), ainsi que le nom, la description, le poids et la taille. Les statistiques sont extraites d'un fichier JSON intégré dans le projet, situé à /pwa/public/stat_pokemons_1G.json. Notez que les images sont des liens vers le dépôt GitHub des images de PokéAPI.

Ce projet est une première version qui sera améliorée à l'avenir. N'oubliez pas de modifier la configuration du serveur et de la base de données si vous souhaitez l'utiliser en dehors d'un environnement de développement.

## Outils utilisés

    PokéAPI : https://pokeapi.co/?ref=public-apis
    API Platform for Symfony : https://api-platform.com/docs/symfony/
    Tailwind CSS : https://tailwindcss.com/
    Docker : https://www.docker.com/




