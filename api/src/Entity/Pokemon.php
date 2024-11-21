<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\PokemonRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;

#[ApiResource(operations: [
    new GetCollection(
        uriTemplate: '/pokemon', // Chemin pour obtenir tous les Pokémon
    ),
    new Get(
        uriTemplate: '/pokemon/{id}', // Chemin pour obtenir un Pokémon spécifique
        requirements: ['id' => '\d+'], // Exigence que l'ID doit être un nombre
    ),
    new Post(
        uriTemplate: '/pokemon', // Chemin pour créer un Pokémon
    ),
    new Put(
        uriTemplate: '/pokemon/{id}', // Chemin pour mettre à jour un Pokémon
        requirements: ['id' => '\d+'], // Exigence que l'ID doit être un nombre
    ),
    new Patch( // Ajout de l'opération PATCH
        uriTemplate: '/pokemon/{id}', // Chemin pour mettre à jour partiellement un Pokémon
        requirements: ['id' => '\d+'], // Exigence que l'ID doit être un nombre
    ),
    new Delete(
        uriTemplate: '/pokemon/{id}', // Chemin pour supprimer un Pokémon
        requirements: ['id' => '\d+'], // Exigence que l'ID doit être un nombre
    ),
])]
#[ORM\Entity(repositoryClass: PokemonRepository::class)]
#[ApiFilter(BooleanFilter::class, properties: ['importe'])]
class Pokemon
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    private ?string $name = null;

    #[ORM\Column]
    private ?int $numpokedex = null;

    #[ORM\Column(length: 50)]
    private ?string $type1 = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $type2 = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(length: 255)]
    private ?string $images = null;

    #[ORM\Column]
    private ?int $hp = null;

    #[ORM\Column]
    private ?int $attack = null;

    #[ORM\Column]
    private ?int $defense = null;

    #[ORM\Column]
    private ?int $vitesse = null;

    #[ORM\Column]
    private ?int $special = null;

    #[ORM\Column]
    private ?float $poids = null;

    #[ORM\Column]
    private ?float $taille = null;

    #[ORM\Column]
    private ?bool $importe = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getNumpokedex(): ?int
    {
        return $this->numpokedex;
    }

    public function setNumpokedex(int $numpokedex): static
    {
        $this->numpokedex = $numpokedex;

        return $this;
    }

    public function getType1(): ?string
    {
        return $this->type1;
    }

    public function setType1(string $type1): static
    {
        $this->type1 = $type1;

        return $this;
    }

    public function getType2(): ?string
    {
        return $this->type2;
    }

    public function setType2(?string $type2): static
    {
        $this->type2 = $type2;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getImages(): ?string
    {
        return $this->images;
    }

    public function setImages(string $images): static
    {
        $this->images = $images;

        return $this;
    }

    public function getHp(): ?int
    {
        return $this->hp;
    }

    public function setHp(int $hp): static
    {
        $this->hp = $hp;

        return $this;
    }

    public function getAttack(): ?int
    {
        return $this->attack;
    }

    public function setAttack(int $attack): static
    {
        $this->attack = $attack;

        return $this;
    }

    public function getDefense(): ?int
    {
        return $this->defense;
    }

    public function setDefense(int $defense): static
    {
        $this->defense = $defense;

        return $this;
    }

    public function getVitesse(): ?int
    {
        return $this->vitesse;
    }

    public function setVitesse(int $vitesse): static
    {
        $this->vitesse = $vitesse;

        return $this;
    }

    public function getSpecial(): ?int
    {
        return $this->special;
    }

    public function setSpecial(int $special): static
    {
        $this->special = $special;

        return $this;
    }

    public function getPoids(): ?float
    {
        return $this->poids;
    }

    public function setPoids(float $poids): static
    {
        $this->poids = $poids;

        return $this;
    }

    public function getTaille(): ?float
    {
        return $this->taille;
    }

    public function setTaille(float $taille): static
    {
        $this->taille = $taille;

        return $this;
    }
    
    public function isImporte(): ?bool
    {
        return $this->importe;
    }

    public function setImporte(bool $importe): static
    {
        $this->importe = $importe;

        return $this;
    }
}
