import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../components/pokemon/Form";
import Navbar from '../components/common/Navbar'; // Importez votre Navbar

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Créer son Pokémon</title>
      </Head>
    </div>
    <Navbar />
    <Form />
  </div>
);

export default Page;
