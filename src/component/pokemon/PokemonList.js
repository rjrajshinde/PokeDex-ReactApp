import React, { useState, useEffect } from "react";
import PokemonCard from "./PokemonCard.js";
import "../../css/PokemonList.css";

export default function PokemonList() {
  const [url, setUrl] = useState("https://pokeapi.co/api/v2/pokemon");
  const [pokemon, setPokemon] = useState([]);

  const getAllPokemons = async () => {
    const res = await fetch(url);
    const data = await res.json();
    setUrl(data.next);

    function createPokemonObject(input) {
      input.forEach(async (ele) => {
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${ele.name}`
        );
        const data = await res.json();
        setPokemon((currentList) => [...currentList, data]);
      });
    }
    createPokemonObject(data.results);
  };

  useEffect(() => {
    getAllPokemons();
  }, []);

  return (
    <>
      {pokemon ? (
        <>
          <div className="row">
            {pokemon.map((pokemon) => (
              <PokemonCard
                name={pokemon.name}
                data={pokemon}
                key={pokemon.name}
              />
            ))}
          </div>
          <div className="text-center mb-4">
            {/* <button className="btn btn-dark" onClick={() => getAllPokemons()}>
              <span>Load More</span>
            </button> */}

            <button
              className="button-54"
              role="button"
              onClick={() => getAllPokemons()}
            >
              Load More Pokemons
            </button>
          </div>
        </>
      ) : (
        <div className="text-center">
          <h6>It will take Some time to Load.</h6>
          <h6 className=" text-danger p-3">
            If it takes much time. Then Please Kindly Check your Network
            Connection!
          </h6>
        </div>
      )}
    </>
  );
}
