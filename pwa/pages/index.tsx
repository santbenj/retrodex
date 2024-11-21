import Head from "next/head";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Navbar from '../components/common/Navbar';
import Link from "next/link";
import "@fontsource/poppins";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import axios from "axios";
import statis from "../public/stat_pokemons_1G.json";

interface Pokemon {
  numpokedex: number;
  name: string;
  description: string;
  images: string;
  type1: string;
  type2?: string;
  hp: number;
  attack: number;
  defense: number;
  vitesse: number;
  special: number;
  poids: number;
  taille: number;
  importe: boolean;
}

interface ApiResponse {
  'hydra:member': Pokemon[];
  'hydra:view'?: {
    'hydra:next'?: string;
  };
}

const fetchExistingPokemons = async (): Promise<Pokemon[]> => {
  let allPokemons: Pokemon[] = [];
  let currentPageUrl = '/pokemon?page=1';

  while (currentPageUrl) {
    const response = await axios.get<ApiResponse>(`https://localhost${currentPageUrl}`);
    const pokemons = response.data['hydra:member'];
    allPokemons = allPokemons.concat(pokemons);

    const view = response.data['hydra:view'];
    currentPageUrl = view && typeof view['hydra:next'] === 'string' ? view['hydra:next'] : null;
  }

  return allPokemons;
};

const importPokemon = async (pokemon: Pokemon) => {
  const response = await axios.post('https://localhost/pokemon', pokemon, {
    headers: {
      'Accept': 'application/ld+json',
      'Content-Type': 'application/ld+json',
    },
  });
  return response.data;
};

const fetchPokemonData = async (id: number) => {
  const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
  const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

  if (!speciesResponse.ok || !pokemonResponse.ok) {
    throw new Error(`Erreur lors de la récupération des données pour le Pokémon ${id}`);
  }

  const speciesData = await speciesResponse.json();
  const pokemonData = await pokemonResponse.json();

  const name = speciesData.names.find((n: { language: { name: string }; name: string }) => n.language.name === 'fr')?.name;
  const description = speciesData.flavor_text_entries.find((entry: { language: { name: string }; flavor_text: string }) => entry.language.name === 'fr')?.flavor_text;
  const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/transparent/${id}.png`;
  const weight = pokemonData.weight / 10;
  const height = pokemonData.height / 10;
  const numpokedex = id;

  let type1 = pokemonData.types[0].type.name;
  let type2 = pokemonData.types.length > 1 ? pokemonData.types[1].type.name : null;

  // Vérification des past_types
  const pastTypes = pokemonData.past_types;
  if (pastTypes && pastTypes.length > 0) {
    const oldTypes = pastTypes[0].types.map((t: any) => t.type.name);
    if (oldTypes.length > 0 && (oldTypes[0] !== type1 || oldTypes[1] !== type2)) {
      type1 = oldTypes[0]; // Remplacer le type1 par l'ancien type
      type2 = oldTypes[1] || null; // Remplacer le type2 par l'ancien type s'il existe
    }
  }

  return { name, description, image, weight, height, numpokedex, type1, type2 };
};

const RetroDex = () => {
  const router = useRouter();
  const [existingPokemons, setExistingPokemons] = useState<Pokemon[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingVerification, setLoadingVerification] = useState(false);
  const [importedCount, setImportedCount] = useState(0);

  useEffect(() => {
    const loadExistingPokemons = async () => {
      setLoadingVerification(true);
      try {
        const pokemons = await fetchExistingPokemons();
        setExistingPokemons(pokemons);
      } catch (error) {
        setMessage(`Erreur lors du chargement des Pokémons : ${error.message}`);
      } finally {
        setLoadingVerification(false);
      }
    };
    loadExistingPokemons();
  }, []);

  const importPokemons = useCallback(async () => {
    if (loadingVerification) {
      setMessage('Veuillez patienter encore un peu, la vérification est en cours...');
      return;
    }

    setLoading(true);
    setMessage('Importation en cours...');
    setImportedCount(0);

    try {
      for (let i = 1; i <= 151; i++) {
        try {
          const { name, description, image, weight, height, numpokedex, type1, type2 } = await fetchPokemonData(i);
          
          // Vérifier les doublons
          const exists = existingPokemons.some(p => p.numpokedex === numpokedex && p.importe === true);
          if (exists) {
            setMessage(`Le Pokémon ${name} existe déjà et a été importé, saut de l'importation.`);
            continue; // Passer au Pokémon suivant
          }

          // Récupérer les statistiques depuis le fichier JSON
          const stat = statis.find((s: any) => s["id "] === numpokedex.toString());
          const hp = stat ? parseInt(stat.hp) : 0;
          const attack = stat ? parseInt(stat.attack) : 0;
          const defense = stat ? parseInt(stat.defense) : 0;
          const vitesse = stat ? parseInt(stat.speed) : 0;
          const special = stat ? parseInt(stat.special) : 0;

          // Créer le Pokémon dans la base de données via l'API
          await importPokemon({
            numpokedex,
            name,
            description,
            images: image,
            type1,
            type2,
            hp,
            attack,
            defense,
            vitesse,
            special,
            poids: weight,
            taille: height,
            importe: true,
          });

          setImportedCount(prevCount => prevCount + 1); // Incrémenter le compteur
        } catch (error) {
          setMessage(prev => `${prev}\nErreur lors de l'importation du Pokémon ${i} : ${error.message}`);
        }
      }

      setMessage('Importation réussie !');
      router.push('/retrodex');
    } catch (error) {
      setMessage(`Erreur lors de l'importation : ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [existingPokemons, loadingVerification, router]);

  return (
    <div className="w-full overflow-x-hidden">
      <Head>
        <title>Bienvenue dans le RetroDex Pokémon!</title>
      </Head>
      <Navbar />
      <section className="w-full bg-gray-100 py-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl text-green-600 font-bold mb-4">
            Bienvenue dans le RetroDex Pokémon 1G!
          </h1>
          <p className="text-lg text-gray-700 mb-5">
            Découvrez les 151 Pokémons de la première génération avec leurs images, statistiques et types d'origine.
          </p>
          <p className="text-lg text-gray-700 mb-5">
            Vous pouvez également créer votre propre Pokémon, le modifier puis le supprimer, vous pouvez également modifier et supprimer les 151 Pokémons originaux mais il faudra les importer. Il faut juste cliquer sur le bouton ci-dessous.
          </p>

          <button
            onClick={importPokemons}
            className="bg-green-500 text-white px-4 py-2 rounded mb-5"
            disabled={loading} // Désactiver le bouton si l'importation est en cours
          >
            {loading ? 'Importation en cours...' : 'Importer les 151 Pokémons'}
          </button>

          {message && <p className="mt-4 text-red-500">{message}</p>}
          <p>{importedCount} Pokémons importés sur 151.</p>
        </div>
      </section>
      <section className="bg-white py-8">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="text-black text-md font-bold mb-5">
              Services disponibles :
            </h2>
            <div className="flex justify-center flex-wrap">
            <Card title="Liste Pokémons" url="/retrodex" disabled={loading} />
              <Card title="Création Pokémon" url="/create" disabled={loading} />
              <Card title="API" url="/docs" disabled={loading} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const Card = ({
  url,
  title,
  disabled,
}: {
  url: string;
  title: string;
  disabled?: boolean;
}) => (
  <div className="w-full max-w-xs p-2">
    <Link
      href={disabled ? '#' : url} // Désactiver le lien si disabled
      className={`w-full flex items-center flex-col justify-center shadow-md p-3 min-h-24 transition-colors text-green-500 border-4 border-transparent ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:border-green-200 hover:text-green-700'}`}
      onClick={disabled ? (e) => e.preventDefault() : undefined} // Prévenir le clic si désactivé
    >
      <h3 className="text-center text-base uppercase font-semibold leading-tight pt-3">
        {title}
      </h3>
    </Link>
  </div>
);

export default RetroDex;


