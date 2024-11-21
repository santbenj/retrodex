import { FunctionComponent, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import { fetch, getItemPath } from "../../utils/dataAccess";
import { Pokemon } from "../../types/Pokemon";
import { FaWeight, FaRuler, FaEdit, FaTrash, FaFileImport, FaPlus } from "react-icons/fa";

interface Props {
  pokemon: Pokemon;
  text: string;
}

export const Show: FunctionComponent<Props> = ({ pokemon, text }) => {
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleDelete = useCallback(async () => {
    if (!pokemon["@id"]) return;

    try {
      await fetch(pokemon["@id"], { method: "DELETE" });
      router.push("/retrodex");
    } catch (error) {
      setError("Erreur lors de la suppression de la ressource.");
      console.error(error);
    }
  }, [pokemon, router]);

  const maxStats = {
    hp: 255,
    attack: 255,
    defense: 255,
    vitesse: 255,
    special: 255,
  };

  const normalizeValue = (value: number, max: number): number => {
    return (value / max) * 100;
  };

  const typeCombinations = {
    fire: "bg-red-500",
    water: "bg-blue-500",
    grass: "bg-green-500",
    electric: "bg-yellow-500",
    poison: "bg-purple-500",
    flying: "bg-sky-400",
    normal: "bg-gray-300",
    psychic: "bg-pink-500",
    fighting: "bg-red-700",
    dragon: "bg-indigo-500",
    ground: "bg-amber-800",
    ice: "bg-teal-400",
    rock: "bg-gray-600",
    bug: "bg-green-700",
    ghost: "bg-blue-800",
  };
  const getBackgroundColor = () => {
    const combinations = [
      { types: ["fire", "flying"], className: "bg-gradient-to-r from-red-500 to-sky-400" },
      { types: ["water", "flying"], className: "bg-gradient-to-r from-blue-500 to-sky-400" },
      { types: ["water", "fighting"], className: "bg-gradient-to-r from-blue-500 to-red-700" },
      { types: ["water", "fighting"], className: "bg-gradient-to-r from-blue-500 to-red-700" },
      { types: ["water", "fighting"], className: "bg-gradient-to-r from-blue-500 to-red-700" },
      { types: ["water", "fighting"], className: "bg-gradient-to-r from-blue-500 to-red-700" },
      { types: ["water", "fighting"], className: "bg-gradient-to-r from-blue-500 to-red-700" },
      { types: ["water", "fighting"], className: "bg-gradient-to-r from-blue-500 to-red-700" },
      { types: ["water", "fighting"], className: "bg-gradient-to-r from-blue-500 to-red-700" },
      { types: ["water", "fighting"], className: "bg-gradient-to-r from-blue-500 to-red-700" },
      { types: ["water", "fighting"], className: "bg-gradient-to-r from-blue-500 to-red-700" },
      { types: ["water", "fighting"], className: "bg-gradient-to-r from-blue-500 to-red-700" },
      { types: ["water", "fighting"], className: "bg-gradient-to-r from-blue-500 to-red-700" },
      { types: ["water", "poison"], className: "bg-gradient-to-r from-blue-500 to-purple-500" },
      { types: ["water", "ice"], className: "bg-gradient-to-r from-blue-500 to-teal-400" },
      { types: ["water", "psychic"], className: "bg-gradient-to-r from-blue-500 to-pink-500" },
      { types: ["grass", "poison"], className: "bg-gradient-to-r from-green-500 to-purple-500" },
      { types: ["grass", "psychic"], className: "bg-gradient-to-r from-green-500 to-pink-500" },
      { types: ["ice", "psychic"], className: "bg-gradient-to-r from-teal-400 to-pink-500" },
      { types: ["ice", "flying"], className: "bg-gradient-to-r from-teal-400 to-sky-400" },
      { types: ["electric", "flying"], className: "bg-gradient-to-r from-yellow-500 to-sky-400" },
      { types: ["bug", "poison"], className: "bg-gradient-to-r from-green-700 to-purple-500" },
      { types: ["bug", "grass"], className: "bg-gradient-to-r from-green-700 to-green-500" },
      { types: ["bug", "flying"], className: "bg-gradient-to-r from-green-700 to-sky-400" },
      { types: ["normal", "flying"], className: "bg-gradient-to-r from-gray-300 to-sky-400" },
      { types: ["poison", "ground"], className: "bg-gradient-to-r from-purple-500 to-amber-800" },
      { types: ["poison", "flying"], className: "bg-gradient-to-r from-purple-500 to-sky-400" },
      { types: ["rock", "water"], className: "bg-gradient-to-r from-gray-600 to-blue-500" },
      { types: ["rock", "ground"], className: "bg-gradient-to-r from-gray-600 to-amber-800" },
      { types: ["rock", "flying"], className: "bg-gradient-to-r from-indigo-500 to-sky-400" },
      { types: ["ground", "rock"], className: "bg-gradient-to-r from-amber-800 to-gray-600" },
      { types: ["ghost", "poison"], className: "bg-gradient-to-r from-blue-800 to-purple-500" },
      { types: ["dragon", "flying"], className: "bg-gradient-to-r from-indigo-500 to-sky-400" },
    ];
    // Si le Pokémon a un type double
    if (pokemon.type2) {
      const combination = combinations.find(comb =>
        comb.types.includes(pokemon.type1) && comb.types.includes(pokemon.type2)
      );
  
      // Retourner la classe de la combinaison si trouvée, sinon la couleur par défaut
      return combination ? combination.className : "bg-gradient-to-r from-green-500 via-red-500 to-blue-500";
    }
  
    // Si le Pokémon a un type simple, retourner la couleur correspondante
    return typeCombinations[pokemon.type1] || "bg-gradient-to-r from-green-500 via-red-500 to-blue-500";
  };

  return (
    <div className={`p-4 ${getBackgroundColor()}`}>
      <Head>
        <title>{`N°${pokemon.numpokedex} ${pokemon.name}`}</title>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </Head>

      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className={`p-4 text-black`}>
          <div className="flex justify-between items-center">
            <span className={`ml-2 ${pokemon.importe ? 'text-green-500' : 'text-blue-500'}`}>
              {pokemon.importe ? <FaFileImport /> : <FaPlus />}
            </span>
            <h2 className="text-xl font-bold">{pokemon.name}</h2>
            <p className="text-sm">#{pokemon.numpokedex}</p>
          </div>
        </div>
        <div className="flex justify-center my-4">
          <img src={pokemon.images} alt={pokemon.name} className="w-64 h-64 object-cover" />
        </div>
        <div className="flex justify-center space-x-2 mt-2">
          <img src={`/types/${pokemon.type1}.png`} alt={pokemon.type1} className="w-24 h-6" />
          {pokemon.type2 && (
            <img src={`/types/${pokemon.type2}.png`} alt={pokemon.type2} className="w-24 h-6" />
          )}
        </div>
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center">
            <FaWeight className="w-6 h-6 mr-2" />
            <span>{pokemon.poids} kg</span>
          </div>
          <div className="flex items-center">
            <FaRuler className="w-6 h-6 mr-2" />
            <span>{pokemon.taille} m</span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold">Description</h3>
          <p>{pokemon.description}</p>
          <div className="p-4">
            <h3 className="text-lg font-semibold mt-4">Statistiques de base</h3>
            <div className="mt-2">
              {[
                { label: "HP", value: pokemon.hp, max: maxStats.hp },
                { label: "Attaque", value: pokemon.attack, max: maxStats.attack },
                { label: "Défense", value: pokemon.defense, max: maxStats.defense },
                { label: "Vitesse", value: pokemon.vitesse, max: maxStats.vitesse },
                { label: "Spécial", value: pokemon.special, max: maxStats.special },
              ].map(stat => {
                const normalizedValue = normalizeValue(stat.value, stat.max);
                return (
                  <div key={stat.label} className="mb-2">
                    <div className="flex justify-between">
                      <span>{stat.label}</span>
                      <span>{stat.value}</span>
                    </div>
                    <div className="relative w-full h-2 bg-gray-200 rounded">
                      <div
                        className="absolute h-full bg-blue-500 rounded"
                        style={{ width: `${normalizedValue}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center">
            <button
              className="text-blue-500 hover:text-blue-700"
              onClick={() => router.push(getItemPath(pokemon["@id"], "/retrodex/[id]/edit"))}
              aria-label="Modifier le Pokémon"
            >
              <FaEdit className="w-6 h-6" />
            </button>
          </div>
          <div className="flex items-center">
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => setIsModalOpen(true)}
              aria-label="Supprimer le Pokémon"
            >
              <FaTrash className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      {error && (
        <div
          className="border px-4 py-3 my-4 rounded text-red-700 border-red-400 bg-red-100"
          role="alert"
        >
          {error}
        </div>
      )}

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
                aria-label="Confirmer la suppression"
              >
                Supprimer
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                onClick={() => setIsModalOpen(false)}
                aria-label="Annuler la suppression"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

