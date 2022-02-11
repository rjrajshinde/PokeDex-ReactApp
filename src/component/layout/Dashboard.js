import React from "react";
import PokemonList from "../pokemon/PokemonList.js";

export default function Dashboard() {
  return (
    <div>
      <div className="row">
        <div className="col">
          <PokemonList />
        </div>
      </div>
    </div>
  );
}
