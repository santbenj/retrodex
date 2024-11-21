import { GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";
import {PageList} from "../../components/pokemon/PageList"; 

import {
  getPokemons,
  getPokemonsPath,
} from "../../components/pokemon/PageList";

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getPokemonsPath(), getPokemons());

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export default PageList;
