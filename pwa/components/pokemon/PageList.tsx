import { NextComponentType, NextPageContext } from "next";
import { useEffect, useState } from "react";
import Head from "next/head";
import { List } from "./List";
import { Pokemon } from "../../types/Pokemon";
import axios from "axios";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import Pagination from "../common/Pagination";
import { PagedCollection } from "../../types/collection";

import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getPokemonsPath = (page?: string | string[] | undefined) =>
    `/pokemon${typeof page === "string" ? `?page=${page}` : ""}`;

export const getPokemons = (page?: string | string[] | undefined) => async () =>
    await fetch<PagedCollection<Pokemon>>(getPokemonsPath(page));
  const getPagePath = (path: string) =>
    `/pokemons/page/${parsePage("pokemon", path)}`;

const fetchAllPokemons = async () => {
    let allPokemons: any[] = [];
    let currentPageUrl = '/pokemon?page=1'; // Commencer à la première page

    while (currentPageUrl) {
        const response = await axios.get(`https://localhost${currentPageUrl}`);
        const pokemons = response.data['hydra:member'];
        allPokemons = allPokemons.concat(pokemons); // Ajouter les Pokémons de la page actuelle à la liste totale

        // Vérifier si 'hydra:view' est défini et contient 'hydra:next'
        const view = response.data['hydra:view'];
        const nextPageUrl = view && typeof view['hydra:next'] === 'string' ? view['hydra:next'] : null;

        if (nextPageUrl) {
            currentPageUrl = nextPageUrl; // Passer à la page suivante
        } else {
            currentPageUrl = null; // Sortir de la boucle
        }
    }

    return allPokemons; // Retourner tous les Pokémons récupérés
};

export const PageList: NextComponentType<NextPageContext> = () => {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPokemons = async () => {
            try {
                const allPokemons = await fetchAllPokemons();
                setPokemons(allPokemons);
            } catch (err) {
                setError("Erreur lors de la récupération des s.");
            } finally {
                setLoading(false);
            }
        };

        loadPokemons();
    }, []);

    if (loading) return <p>Chargement des Pokémons...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <Head>
                <title>Liste des Pokémons</title>
            </Head>
            <List pokemons={pokemons} />
        </div>
    );
};
