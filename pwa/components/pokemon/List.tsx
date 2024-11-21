import React, { FunctionComponent, useMemo, useState } from "react";
import Link from "next/link";
import { FaEdit, FaSearch, FaTrash } from "react-icons/fa";
import Image from 'next/image';

import { getItemPath } from "../../utils/dataAccess";
import { Pokemon } from "../../types/Pokemon";
import { useRouter } from 'next/router'; // Importation de useRouter
import Navbar from '../../components/common/Navbar'; // Importez votre Navbar


interface Props {
  pokemons: Pokemon[];
}

const PokemonCard: FunctionComponent<{ pokemon: Pokemon; onDelete: (id: string) => void }> = React.memo(({ pokemon, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // État pour gérer l'ouverture de la modale

  const handleDelete = () => {
    onDelete(pokemon["@id"]); // Appel de la fonction de suppression
    setIsModalOpen(false); // Ferme la modale après la suppression
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center transition-transform transform hover:scale-105 relative">
      <div className="flex justify-between w-full mb-2">
      <Link
        href={getItemPath(pokemon["@id"], "/retrodex/[id]")}
        className="absolute top-2 left-2 text-gray-600 hover:text-blue-500"
      >
        <FaSearch className="w-6 h-6" />
      </Link>

        <span className="text-gray-600 font-semibold ml-auto">{pokemon["numpokedex"]}</span>
      </div>
      <div className="img-wrap mb-2">
        {pokemon["images"] && (
          <Image
            src={pokemon["images"]}
            alt={pokemon["name"] as string}
            width={128}
            height={128}
            className="rounded-full"
          />
        )}
      </div>
      <h2 className="text-xl font-bold text-gray-800 capitalize" style={{ fontFamily: 'Press Start 2P, cursive' }}>{pokemon["name"]}</h2>
      <div className="flex justify-between mt-4 w-full">
        <span className="ml-auto">
          <Link
            href={getItemPath(pokemon["@id"], "/retrodex/[id]/edit")}
            className="absolute bottom-2 left-3 text-gray-600 hover:text-blue-500"
          >
            <FaEdit className="w-6 h-6" />
          </Link>
        </span>
      </div>
      <div className="flex items-center">
            <button
              className="text-gray-600 hover:text-red-700 absolute bottom-2 right-2"
              onClick={() => setIsModalOpen(true)} // Ouvre la modale de confirmation
            >
              <FaTrash className="w-6 h-6" />
            </button>
          </div>
      
      {/* Modale de confirmation de suppression */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold">Confirmation de suppression</h3>
            <p>Êtes-vous sûr de vouloir supprimer ce Pokémon ?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                onClick={handleDelete}
              >
                Supprimer
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                onClick={() => setIsModalOpen(false)} // Ferme la modale
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export const List: FunctionComponent<Props> = ({ pokemons }) => {
  const router = useRouter(); // Initialisation de useRouter
  const [pokemonList, setPokemonList] = useState<Pokemon[]>(pokemons); // État pour les Pokémons

  const handleDelete = async (id: string) => {
    if (!id) return;

    try {
      await fetch(id, { method: "DELETE" });
      // Mettez à jour l'état local pour supprimer le Pokémon
      setPokemonList(prevList => prevList.filter(pokemon => pokemon["@id"] !== id));
    } catch (error) {
      console.error("Error when deleting the resource:", error);
    }
  };

  const importedPokemons = useMemo(() =>
    pokemonList.filter(pokemon => pokemon.importe === true).sort((a, b) => a.numpokedex - b.numpokedex),
    [pokemonList]
  );

  const createdOrModifiedPokemons = useMemo(() =>
    pokemonList.filter(pokemon => pokemon.importe === false).sort((a, b) => a.numpokedex - b.numpokedex),
    [pokemonList]
  );

  return (
    <div className="w-full overflow-x-hidden">
      <Navbar /> {/* Utilisez le composant Navbar ici */}
      <div className="p-4 bg-gradient-to-r from-green-500 via-red-500 to-blue-500">
      
      <h2 className="text-2xl mt-4 text-gray-800">Pokémons importés :</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {importedPokemons.map(pokemon => (
          <PokemonCard key={pokemon["@id"]} pokemon={pokemon} onDelete={handleDelete} />
        ))}
      </div>

      <h2 className="text-2xl mt-4 text-gray-800">Pokémons créés/modifiés :</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {createdOrModifiedPokemons.map(pokemon => (
          <PokemonCard key={pokemon["@id"]} pokemon={pokemon} onDelete={handleDelete} />
        ))}
      </div>
    </div>
    </div>
    
  );
};

