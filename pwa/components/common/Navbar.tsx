import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-lg font-bold flex items-center hover:text-green-500 transition duration-200" aria-label="Accueil">
          RetroDex
        </Link>
        <div className="flex space-x-4">
          <Link href="/retrodex" className="text-white hover:text-green-500 transition duration-200" aria-label="Liste des Pokémons">
            Liste
          </Link>
          <Link href="/create" className="text-white hover:text-green-500 transition duration-200" aria-label="Créer un Pokémon">
            Création
          </Link>
          <Link href="/docs" className="text-white hover:text-green-500 transition duration-200" aria-label="API Plateform">
            API
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
