import {
  GetStaticPaths,
  GetStaticProps,
  NextComponentType,
  NextPageContext,
} from "next";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQuery } from "react-query";

import { Show } from "../../../components/pokemon/Show";
import { PagedCollection } from "../../../types/collection";
import { Pokemon } from "../../../types/Pokemon";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";
import Navbar from '../../../components/common/Navbar'; // Importez votre Navbar


const getPokemon = async (id: string | string[] | undefined) =>
  id ? await fetch<Pokemon>(`/pokemon/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: pokemon, hubURL, text } = { hubURL: null, text: "" } } =
    useQuery<FetchResponse<Pokemon> | undefined>(["pokemon", id], () =>
      getPokemon(id)
    );
  const pokemonData = useMercure(pokemon, hubURL);

  if (!pokemonData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Pokémon ${pokemonData["@id"]}`}</title>
        </Head>
      </div>
      <Navbar />
      <Show pokemon={pokemonData} text={text} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["pokemon", id], () => getPokemon(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Pokemon>>("/pokemon");
  const paths = await getItemPaths(response, "pokemon", "/retrodex/[id]");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
