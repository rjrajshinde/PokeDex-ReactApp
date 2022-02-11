import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../css/PokemonCard.css";
import loader from "../../images/pokeball.svg";

const Sprite = styled.img`
  width: 6em;
  height: 6em;
  display: none;
`;

const PokeCard = styled.div`
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  &:hover {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    text-decoration: none;
  }
  outline: none;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #000;
  &:hover,
  &:active {
    color: #000;
  }
`;

export default function PokemonCard(props) {
  const [imageLoading, setImageLoading] = useState(true);
  const [pokemonImageUrl, setPokemonImageUrl] = useState();
  const [color, setColor] = useState();
  const [pokemonIndex, setPokemonIndex] = useState();

  useEffect(() => {
    getPokemon(props.data);
  }, [props.data]);

  const getPokemon = async (data) => {
    //todo    to get the pokemon image url from json
    setPokemonImageUrl(data.sprites.front_default);

    //todo    to get the pokemon card color as per their abilities and colors
    const CardColor = await axios.get(data.species.url);
    setColor(CardColor.data.color.name);

    //todo    to get the pokemon index as a id for redirecting them from json
    const indexURL = data.location_area_encounters;
    const index = indexURL.split("/")[indexURL.split("/").length - 2];
    setPokemonIndex(index);
  };

  return (
    <div className="col-md-3 col-lg-2 col-sm-4 col-6 mb-4">
      <StyledLink
        to={{
          pathname: `pokemon/${pokemonIndex}`,
        }}
        state={{
          index: { pokemonIndex: pokemonIndex },
        }}
      >
        <PokeCard className={`card ${color}`}>
          {imageLoading ? (
            <img
              src={loader}
              style={{ width: "2.5em", height: "2.5em" }}
              id="poke"
              className="card-img-top rounded mx-auto mt-4"
              alt="pokemon Images"
            ></img>
          ) : null}
          <Sprite
            className="card-img-top rounded mx-auto mt-2"
            onLoad={() => setImageLoading(() => false)}
            src={pokemonImageUrl}
            style={imageLoading ? { display: "none" } : { display: "block" }}
          ></Sprite>
          <div className="card-body mx-auto">
            <h6 className="card-title">
              {/* this is for to make capitalise the first letter of pokemon name */}
              {props.name
                .toLowerCase()
                .split(" ")
                .map(
                  (letter) =>
                    letter.charAt(0).toUpperCase() + letter.substring(1)
                )
                .join(" ")}
              <br />
            </h6>
          </div>
        </PokeCard>
      </StyledLink>
    </div>
  );
}
