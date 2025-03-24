import { FunctionComponent, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Formik } from "formik";
import * as Yup from 'yup';
import { useMutation } from "react-query";
import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Pokemon } from "../../types/Pokemon";

// Interface pour les props
interface Props {
  pokemon?: Pokemon;
}

// Interface pour les paramètres de sauvegarde
interface SaveParams {
  values: Pokemon;
}

// Interface pour les valeurs du formulaire
interface FormValues {
  name: string;
  type1: string;
  type2?: string;
  hp: number;
  attack: number;
  defense: number;
  vitesse: number;
  special: number;
  poids: number;
  taille: number;
  description?: string;
  images?: string;
  "@id"?: string;
  numpokedex?: number;
  importe?: boolean;
}

// Fonction pour sauvegarder un Pokémon
const savePokemon = async ({ values }: SaveParams) =>
  await fetch<Pokemon>(!values["@id"] ? "/pokemon" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

// Fonction pour récupérer les Pokémons existants avec le filtre
const fetchExistingPokemons = async () => {
  let allPokemons: any[] = [];
  let currentPageUrl = '/pokemon?page=1&importe=false'; // URL avec le filtre

  while (currentPageUrl) {
    const response = await fetch(`${currentPageUrl}`);
    const pokemons = response.data['hydra:member'];
    allPokemons = allPokemons.concat(pokemons);

    const view = response.data['hydra:view'];
    const nextPageUrl = view && typeof view['hydra:next'] === 'string' ? view['hydra:next'] : null;

    currentPageUrl = nextPageUrl ? nextPageUrl : null;
  }

  return allPokemons;
};

// Liste des types
const pokemonTypes = [
  "grass", "fire", "water", "electric", "ice", "fighting", "poison",
  "ground", "flying", "psychic", "bug", "ghost", "dragon", "normal"
];


// Schéma de validation avec Yup
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Le nom est requis. Veuillez entrer un nom valide.'),
  type1: Yup.string().required('Le Type 1 est requis. Veuillez sélectionner un type.'),
  type2: Yup.string().notOneOf([Yup.ref('type1'), null], 'On ne peut pas avoir deux fois le même type !'),
  hp: Yup.number().required('Ce champ est obligatoire. Veuillez entrer un nombre pour les points de vie.').positive('Il faut un nombre positif.'),
  attack: Yup.number().required('Ce champ est obligatoire. Veuillez entrer un nombre pour l\'attaque.').positive('Il faut un nombre positif.'),
  defense: Yup.number().required('Ce champ est obligatoire. Veuillez entrer un nombre pour la défense.').positive('Il faut un nombre positif.'),
  vitesse: Yup.number().required('Ce champ est obligatoire. Veuillez entrer un nombre pour la vitesse.').positive('Il faut un nombre positif.'),
  special: Yup.number().required('Ce champ est obligatoire. Veuillez entrer un nombre pour le spécial.').positive('Il faut un nombre positif.'),
  poids: Yup.number().required('Ce champ est obligatoire. Veuillez entrer un nombre pour le poids.').positive('Il faut un nombre positif.'),
  taille: Yup.number().required('Ce champ est obligatoire. Veuillez entrer un nombre pour la taille.').positive('Il faut un nombre positif.'),
  description: Yup.string().required('Il faut une description. Veuillez fournir une description détaillée.'),
});

export const Form: FunctionComponent<Props> = ({ pokemon }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [availableImages, setAvailableImages] = useState<string[]>([]); // État pour les images disponibles
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<Pokemon> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => savePokemon(saveParams));

  useEffect(() => {
    // Charger les images disponibles (exemple statique)
    const fetchImages = async () => {
      const images = ["/sprite/fossil_aero.png", "/sprite/fossil_kabu.png", "/sprite/ghost.png","/sprite/missingNo.png"]; // Remplacez par un appel API si nécessaire
      setAvailableImages(images);
    };
    fetchImages();
  }, []);

  const handleImageSelect = (image: string) => {
    setSelectedImage(image);
  };

  const handleSubmit = async (values: FormValues, { setSubmitting, setStatus, setErrors }) => {
    // Vérifiez si c'est une création ou une modification
    const isCreation = !values["@id"];
  
    if (selectedImage) {
      values.images = selectedImage; // Ajoutez l'image sélectionnée aux valeurs
    } else if (isCreation) {
      values.images = "/sprite/missingNo.png"; // Image par défaut si aucune sélectionnée lors de la création
    } else {
      // Conserver l'image existante lors de la modification
      values.images = pokemon.images; // Assurez-vous que l'image est bien définie dans l'objet pokemon
    }
  
    // Définir importe à false
    values.importe = false;
  
    if (isCreation) {
      // Logique pour la création
      const existingPokemons = await fetchExistingPokemons();
      const numImportedPokemons = existingPokemons.length; // Nombre de Pokémons non importés
      values.numpokedex = 152 + numImportedPokemons; // Calculer le numpokedex pour la création
    } else {
      // Logique pour la modification
      const existingPokemons = await fetchExistingPokemons();
      const numImportedPokemons = existingPokemons.length; // Nombre de Pokémons sexistants
      values.numpokedex = 152 + numImportedPokemons; // Calculer le numpokedex pour la modification
    }
  
    // Effectuer la mutation pour sauvegarder le Pokémon
    saveMutation.mutate(
      { values },
      {
        onSuccess: () => {
          setStatus({
            isValid: true,
            msg: `le Pokémon est ${isCreation ? "créé" : "modifié"}.`,
          });
          router.push("/retrodex");
        },
        onError: (error) => {
          setStatus({
            isValid: false,
            msg: `Erreur: ${error.message}`,
          });
          if ("fields" in error) {
            setErrors(error.fields);
          } else {
            // Gestion des erreurs générales
            setErrors({ general: "Une erreur est survenue. Veuillez réessayer." });
          }
        },
        onSettled: () => {
          setSubmitting(false);
        },
      }
    );
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <h1 className="text-3xl my-2">
        {pokemon ? `Modifier le Pokémon ` : `Créer un Pokémon`}
      </h1>
      <Formik
        initialValues={
          pokemon
            ? {
              ...pokemon,
              importe: false, // Assurez-vous que importe est défini à false
            }
            : {
              name: '',
              type1: '',
              type2: '',
              hp: 0,
              attack: 0,
              defense: 0,
              vitesse: 0,
              special: 0,
              poids: 0,
              taille: 0,
              description: '',
              images: '',
              "@id": undefined,
              numpokedex: undefined,
              importe: false,
            }
        }
        validationSchema={validationSchema} // Utilisation de Yup pour la validation
        onSubmit={handleSubmit}
      >
        {({
          values,
          status,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form className="shadow-md p-4" onSubmit={handleSubmit}>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="pokemon_name"
              >
                Nom
              </label>
              <input
                name="name"
                id="pokemon_name"
                value={values.name ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${errors.name && touched.name ? "border-red-500" : ""
                  }`}
                aria-invalid={errors.name && touched.name ? "true" : undefined}
                aria-describedby="nameError"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="name"
                id="nameError" // ID pour aria-describedby
              />
            </div>

            {/* Champ Type 1 */}
            <div className="mb-2">
              <label className="text-gray-700 block text-sm font-bold" htmlFor="pokemon_type1">
                Type 1
              </label>
              <select
                name="type1"
                id="pokemon_type1"
                value={values.type1}
                className={`mt-1 block w-full ${errors.type1 && touched.type1 ? "border-red-500" : ""}`}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Selection du 1er Type</option>
                {pokemonTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <ErrorMessage className="text-xs text-red-500 pt-1" component="div" name="type1" />
            </div>

            {/* Champ Type 2 */}
            <div className="mb-2">
              <label className="text-gray-700 block text-sm font-bold" htmlFor="pokemon_type2">
                Type 2
              </label>
              <select
                name="type2"
                id="pokemon_type2"
                value={values.type2}
                className={`mt-1 block w-full ${errors.type2 && touched.type2 ? "border-red-500" : ""}`}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Selection du 2ème Type</option>
                {pokemonTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <ErrorMessage className="text-xs text-red-500 pt-1" component="div" name="type2" />
            </div>

            {/* Champ HP */}
            <div className="mb-2">
              <label className="text-gray-700 block text-sm font-bold" htmlFor="pokemon_hp">
                HP
              </label>
              <input
                name="hp"
                id="pokemon_hp"
                value={values.hp}
                type="number"
                className={`mt-1 block w-full ${errors.hp && touched.hp ? "border-red-500" : ""}`}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage className="text-xs text-red-500 pt-1" component="div" name="hp" />
            </div>
            {/* Champ Attack */}
            <div className="mb-2">
              <label className="text-gray-700 block text-sm font-bold" htmlFor="pokemon_attack">
                Attaque
              </label>
              <input
                name="attack"
                id="pokemon_attack"
                value={values.attack}
                type="number"
                className={`mt-1 block w-full ${errors.attack && touched.attack ? "border-red-500" : ""}`}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage className="text-xs text-red-500 pt-1" component="div" name="attack" />
            </div>

            {/* Champ Defense */}
            <div className="mb-2">
              <label className="text-gray-700 block text-sm font-bold" htmlFor="pokemon_defense">
                Défense
              </label>
              <input
                name="defense"
                id="pokemon_defense"
                value={values.defense}
                type="number"
                className={`mt-1 block w-full ${errors.defense && touched.defense ? "border-red-500" : ""}`}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage className="text-xs text-red-500 pt-1" component="div" name="defense" />
            </div>

            {/* Champ Vitesse */}
            <div className="mb-2">
              <label className="text-gray-700 block text-sm font-bold" htmlFor="pokemon_vitesse">
                Vitesse
              </label>
              <input
                name="vitesse"
                id="pokemon_vitesse"
                value={values.vitesse}
                type="number"
                className={`mt-1 block w-full ${errors.vitesse && touched.vitesse ? "border-red-500" : ""}`}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage className="text-xs text-red-500 pt-1" component="div" name="vitesse" />
            </div>

            {/* Champ Special */}
            <div className="mb-2">
              <label className="text-gray-700 block text-sm font-bold" htmlFor="pokemon_special">
                Spécial
              </label>
              <input
                name="special"
                id="pokemon_special"
                value={values.special}
                type="number"
                className={`mt-1 block w-full ${errors.special && touched.special ? "border-red-500" : ""}`}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage className="text-xs text-red-500 pt-1" component="div" name="special" />
            </div>

            {/* Champ Poids */}
            <div className="mb-2">
              <label className="text-gray-700 block text-sm font-bold" htmlFor="pokemon_poids">
                Poids
              </label>
              <input
                name="poids"
                id="pokemon_poids"
                value={values.poids}
                type="number"
                className={`mt-1 block w-full ${errors.poids && touched.poids ? "border-red-500" : ""}`}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage className="text-xs text-red-500 pt-1" component="div" name="poids" />
            </div>

            {/* Champ Taille */}
            <div className="mb-2">
              <label className="text-gray-700 block text-sm font-bold" htmlFor="pokemon_taille">
                Taille
              </label>
              <input
                name="taille"
                id="pokemon_taille"
                value={values.taille}
                type="number"
                className={`mt-1 block w-full ${errors.taille && touched.taille ? "border-red-500" : ""}`}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage className="text-xs text-red-500 pt-1" component="div" name="taille" />
            </div>
            
            {/* Champ Description */}
            <div className="mb-2">
              <label className="text-gray-700 block text-sm font-bold" htmlFor="pokemon_description">
                Description
              </label>
              <textarea
                name="description"
                id="pokemon_description"
                value={values.description}
                className={`mt-1 block w-full ${errors.description && touched.description ? "border-red-500" : ""}`}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage className="text-xs text-red-500 pt-1" component="div" name="description" />
            </div>
            <div className="mb-2">
              <label className="text-gray-700 block text-sm font-bold">Veuillez chosir une image</label>
              <div className="flex flex-wrap">
                {availableImages.map((image) => (
                  <div key={image} className="m-2">
                    <img
                      src={image}
                      alt="Image Pokémon"
                      className={`w-32 h-32 object-cover cursor-pointer ${selectedImage === image ? "border-2 border-blue-500" : ""}`}
                      onClick={() => handleImageSelect(image)}
                    />
                  </div>
                ))}
              </div>
            </div>
            {status && status.msg && (
              <div
                className={`border px-4 py-3 my-4 rounded ${status.isValid
                  ? "text-cyan-700 border-cyan-500 bg-cyan-200/50"
                  : "text-red-700 border-red-400 bg-red-100"
                  }`}
                role="alert"
              >
                {status.msg}
              </div>
            )}
            <button
              type="submit"
              className="inline-block mt-2 bg-green-500 hover:bg-green-600 text-sm text-white font-bold py-2 px-4 rounded"
              disabled={isSubmitting}
            >
              Envoyer
            </button>
            {isSubmitting && <div className="loader">Loading...</div>} {/* Indicateur de chargement */}
          </form>
        )}
      </Formik>
    </div>
  );
};




