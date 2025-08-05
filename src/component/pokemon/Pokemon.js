import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { Link } from "react-router-dom";
import "../../css/Pokemon.css";
import loader from "../../images/pokeball.svg";
import { useAlert } from "react-alert";

//todo Some Common constants
const statTitleWidth = 3;
const statBarWidth = 9;

const Sprite = styled.img`
  width: 10em;
  height: 10em;
  display: none;
`;

const PlayButton = styled.button`
  font-size: 12px;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  margin-right: 10px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #000;
  &:hover,
  &:active {
    color: #000;
  }
`;

export default function Pokemon() {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageLoading1, setImageLoading1] = useState(true);
  const [name, setName] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [backImageUrl, setBackImageUrl] = useState();
  const [backGroundImg, setBackGroundImg] = useState();
  const [types, setTypes] = useState([]);
  const [description, setDescription] = useState();
  const [hp, setHp] = useState();
  const [attack, setAttack] = useState();
  const [defense, setDefense] = useState();
  const [specialAttack, setSpecialAttack] = useState();
  const [specialDefense, setSpecialDefense] = useState();
  const [speed, setSpeed] = useState();
  const [height, setHeight] = useState();
  const [weight, setWeight] = useState();
  const [eggGroup, setEggGroup] = useState();
  const [abilities, setAbilities] = useState();
  const [genderRatioMale, setGenderRatioMale] = useState();
  const [genderRatioFemale, setGenderRatioFemale] = useState();
  const [evs, setEvs] = useState();
  const [hatchSteps, setHatchSteps] = useState();
  const [catchRate, setCatchRate] = useState();
  const [evoData, setEvoData] = useState([]);
  const [voiceNote, setVoiceNote] = useState();
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(null);

  const location = useLocation();
  const { index } = location.state;

  const alert = useAlert();

  // //todo for go to Top of the screen every time when page load successfully
  // window.onload = function () {
  //   window.scrollTo(0, 0);
  //   console.log("onload");
  // };
  // window.onbeforeunload = function () {
  //   window.scrollTo(0, 0);
  //   console.log("before onload");
  // };

  useEffect(() => {
    //todo to reload the page every time this page route is called
    (function () {
      if (window.localStorage) {
        if (!localStorage.getItem("firstLoad")) {
          localStorage["firstLoad"] = true;
          // window.location.reload();
          window.location.href = window.location.href;
        } else localStorage.removeItem("firstLoad");
      }
    })();

    //! if the pokemon index from link is undefined then show message there is some error and redirect to the homepage
    if (index.pokemonIndex === undefined) {
      alert.error(
        "There is some ERROR here, Please Go Back to Home Page, Wait for to complete the loading and TRY AGAIN!",
        {
          onClose: () => {
            window.location.href = "/";
          },
        }
      );
    }
    getPokemonDetails(index.pokemonIndex);
  }, [index.pokemonIndex]);

  const getPokemonDetails = async (index) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${index}`;

    const result = await axios.get(url);

    //todo get Front image of pokemon
    setImageUrl(result.data.sprites.front_default);

    //todo get back image of pokemon
    setBackImageUrl(result.data.sprites.back_default);

    //todo get background image of pokemon
    setBackGroundImg(
      result.data.sprites.other["official-artwork"].front_default
    );

    //todo get the voice note of the pokemon
    setVoiceNote(result.data.cries.latest);

    //todo get name of the pokemon
    const name = result.data.name
      .toLowerCase()
      .split("-")
      .map((string) => string.charAt(0).toUpperCase() + string.substring(1))
      .join(" ");
    setName(name);

    //! Convert Decimeter to Feet
    const height =
      Math.round((result.data.height * 0.328084 + 0.0001) * 100) / 100;
    setHeight(height);

    //! Convert Hectogram to Kilogram
    const weight = Math.round(result.data.weight / 10);
    setWeight(weight);

    //! To get Hp, Attack, Defense, Special-Attack, Special-Defense, Speed

    result.data.stats.map((stat) => {
      switch (stat.stat.name) {
        case "hp":
          setHp(stat["base_stat"]);
          break;
        case "attack":
          setAttack(stat["base_stat"]);
          break;
        case "defense":
          setDefense(stat["base_stat"]);
          break;
        case "special-attack":
          setSpecialAttack(stat["base_stat"]);
          break;
        case "special-defense":
          setSpecialDefense(stat["base_stat"]);
          break;
        case "speed":
          setSpeed(stat["base_stat"]);
          break;
        default:
          console.log("default");
      }
    });

    //! get the type of pokemon
    const types_var = result.data.types.map((type) => {
      return type.type.name
        .toLowerCase()
        .split("-")
        .map((string) => string.charAt(0).toUpperCase() + string.substring(1))
        .join(" ");
    });
    setTypes(types_var);

    //! get the abilities of pokemon
    const abilities_var = result.data.abilities
      .map((ability) => {
        return ability.ability.name
          .toLowerCase()
          .split("-")
          .map((string) => string.charAt(0).toUpperCase() + string.substring(1))
          .join(" ");
      })
      .join(", ");
    setAbilities(abilities_var);

    //! To get Evs of Pokemon
    const evs_var = result.data.stats
      .filter((stat) => {
        if (stat.effort > 0) {
          return true;
        }
        return false;
      })
      .map((stat) => {
        return `${stat.effort} ${stat.stat.name}`
          .toLowerCase()
          .split("-")
          .map((string) => string.charAt(0).toUpperCase() + string.substring(1))
          .join(" ");
      });
    setEvs(evs_var);

    //! to Get pokemon Description/information
    const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${index}`;

    const speciesRes = await axios.get(speciesUrl);

    var description_var = "";
    var description_var1 = "";
    var description_var2 = "";
    var description_var3 = "";

    speciesRes.data.flavor_text_entries.some((ele) => {
      if (ele.language.name === "en") {
        description_var1 = ele.flavor_text;
        return;
      }
    });
    speciesRes.data.flavor_text_entries.some((ele) => {
      if (ele.language.name === "en" && description_var1 !== ele.flavor_text) {
        description_var2 = ele.flavor_text;
        return;
      }
    });
    speciesRes.data.flavor_text_entries.some((ele) => {
      if (
        ele.language.name === "en" &&
        description_var1 !== ele.flavor_text &&
        description_var2 !== ele.flavor_text
      ) {
        description_var3 = ele.flavor_text;
        return;
      }
    });
    description_var = description_var1 + description_var2 + description_var3;
    setDescription(description_var);

    //! to get femaleGenderRation, and MaleGenderRatio
    const femaleRate = speciesRes.data["gender_rate"];
    const genderRatioFemale_var = 12.5 * femaleRate;
    const genderRatioMale_var = 12.5 * (8 - femaleRate);
    setGenderRatioFemale(genderRatioFemale_var);
    setGenderRatioMale(genderRatioMale_var);

    //! to get the catchRate of Pokemon
    const catchRate_var = Math.round(
      (100 / 255) * speciesRes.data["capture_rate"]
    );
    setCatchRate(catchRate_var);

    //! to get the eggGroups of Pokemon
    const eggGroups_var = speciesRes.data["egg_groups"]
      .map((ele) => {
        return ele.name
          .toLowerCase()
          .split(" ")
          .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(" ");
      })
      .join(", ");
    setEggGroup(eggGroups_var);

    //! to get the hatchSteps of Pokemon
    const hatchSteps_var = 255 * (speciesRes.data["hatch_counter"] + 1);
    setHatchSteps(hatchSteps_var);

    //! to get the evolution images of this pokemon
    const evoUrl = speciesRes.data["evolution_chain"].url;
    const evoRes = await axios.get(evoUrl);
    var evoData = evoRes.data.chain;
    var evoChain = [];
    do {
      evoChain.push({
        name: evoData.species.name,
        url: evoData.species.url,
      });
      evoData = evoData["evolves_to"][0];
    } while (!!evoData && evoData.hasOwnProperty("evolves_to"));

    //! regex to get the id of the pokemon from URL from JSON
    const idRegEx = /[0-9]+/g;
    const evo = [];
    evoChain.map((ele) => {
      const evoId = ele.url.match(idRegEx);
      evo.push({ id: evoId[1], name: ele.name });
    });
    setEvoData(evo);
    // window.scrollTo(0, 0);
  };

  //! To play the voice note
  // const playAudio = () => {
  //   const audio = new Audio(voiceNote);
  //   audio.play();
  // };
  const handlePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(voiceNote);
      audioRef.current.addEventListener("ended", () => {
        setIsPlaying(false); // Reset glow when audio ends
      });
    }

    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <>
      <div
        className="col"
        style={{
          backgroundImage: `url(${backGroundImg})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          className="card"
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            color: "#000",
          }}
        >
          {/* <div className="content"> */}
          <div className="card-header bg-light">
            <div className="row">
              <div className="col-5">
                <h5>{index.pokemonIndex}</h5>
              </div>
              <div className="col-7">
                <div className="float-end">
                  {/* <button type="button" onClick={playAudio}>
                    Click
                  </button> */}
                  <PlayButton
                    onClick={handlePlay}
                    style={{
                      backgroundColor: isPlaying ? "#ffcc00" : "#ddd",
                      boxShadow: isPlaying ? "0 0 10px #ffcc00" : "none",
                    }}
                    title="Play Pokemon Voice Note"
                  >
                    🔊
                  </PlayButton>
                  {types.map((type) => (
                    <span
                      key={type}
                      className={`badge rounded-pill ml-4 ${type}`}
                      style={{
                        color: "#000",
                        fontSize: 14,
                      }}
                    >
                      {type
                        .toLowerCase()
                        .split(" ")
                        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                        .join(" ")}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-3 text-center">
                {imageLoading ? (
                  <img
                    src={loader}
                    style={{ width: "3em", height: "3em" }}
                    id="poke"
                    className="card-img-top rounded mx-auto mt-4"
                    alt="pokemon Images"
                  ></img>
                ) : null}
                <Sprite
                  className="card-img-top rounded mx-auto mt-2 image-fluid"
                  onLoad={() => setImageLoading(() => false)}
                  src={imageUrl}
                  style={
                    imageLoading ? { display: "none" } : { display: "block" }
                  }
                ></Sprite>
              </div>
              <div className="col-md-6">
                <h4 className="mx-auto mb-4 name">{name}</h4>
                <div className="row align-items-center">
                  <div className={`col-12 col-md-${statTitleWidth}`}>HP</div>
                  <div className={`col-12 col-md-${statBarWidth}`}>
                    <div className="progress">
                      <div
                        className="progress-bar "
                        role="progressbar"
                        style={{
                          width: `${hp}%`,
                          backgroundColor: `#00FF00`,
                        }}
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <big className="text-dark">{hp}</big>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row align-items-center">
                  <div className={`col-12 col-md-${statTitleWidth}`}>
                    Attack
                  </div>
                  <div className={`col-12 col-md-${statBarWidth}`}>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${attack}%`,
                          backgroundColor: `#ff0000`,
                        }}
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <big>{attack}</big>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row align-items-center">
                  <div className={`col-12 col-md-${statTitleWidth}`}>
                    Defense
                  </div>
                  <div className={`col-12 col-md-${statBarWidth}`}>
                    <div className="progress">
                      <div
                        className="progress-bar "
                        role="progressbar"
                        style={{
                          width: `${defense}%`,
                          backgroundColor: `#02D1FF`,
                        }}
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <big className="text-dark">{defense}</big>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row align-items-center">
                  <div className={`col-12 col-md-${statTitleWidth}`}>Speed</div>
                  <div className={`col-12 col-md-${statBarWidth}`}>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${speed}%`,
                          backgroundColor: `#F7FF00`,
                        }}
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <big className="text-dark">{speed}</big>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row align-items-center">
                  <div className={`col-12 col-md-${statTitleWidth}`}>
                    Special Attack
                  </div>
                  <div className={`col-12 col-md-${statBarWidth}`}>
                    <div className="progress">
                      <div
                        className="progress-bar "
                        role="progressbar"
                        style={{
                          width: `${specialAttack}%`,
                          backgroundColor: `#790000`,
                        }}
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <big className="text-white">{specialAttack}</big>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row align-items-center">
                  <div className={`col-12 col-md-${statTitleWidth}`}>
                    Special Defense
                  </div>
                  <div className={`col-12 col-md-${statBarWidth}`}>
                    <div className="progress">
                      <div
                        className="progress-bar "
                        role="progressbar"
                        style={{
                          width: `${specialDefense}%`,
                          backgroundColor: `#0247FF`,
                        }}
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <big>{specialDefense}</big>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 text-center">
                {imageLoading ? (
                  <img
                    src={loader}
                    style={{ width: "3em", height: "3em" }}
                    id="poke"
                    className="card-img-top rounded mx-auto mt-4"
                    alt="pokemon Images"
                  ></img>
                ) : null}
                <Sprite
                  className="card-img-top rounded mx-auto mt-2 image-fluid"
                  onLoad={() => setImageLoading(() => false)}
                  src={backImageUrl}
                  style={
                    imageLoading ? { display: "none" } : { display: "block" }
                  }
                ></Sprite>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col">
                <p className="description">{description}</p>
              </div>
            </div>
          </div>
          <div className="card-body">
            <hr />
            <h5 className="card-title text-center">
              <b>Profile</b>
            </h5>
            <hr />
            <div className="row">
              <div className="col-md-6">
                <div className="row">
                  <div className="col-6">
                    <h6 className="float-end">Height:</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-left">{height} ft.</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-end">Weight:</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-left">{weight} lbs</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-end">Catch Rate:</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-left">{catchRate}%</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-end">Gender Ratio:</h6>
                  </div>
                  <div className="col-6">
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${genderRatioFemale}%`,
                          backgroundColor: "#c2185b",
                        }}
                        aria-valuenow="15"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <small>{genderRatioFemale}</small>
                      </div>
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${genderRatioMale}%`,
                          backgroundColor: "#1976d2",
                        }}
                        aria-valuenow="30"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <small>{genderRatioMale}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="row">
                  <div className="col-6">
                    <h6 className="float-end">Egg Groups:</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-start">{eggGroup} </h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-end">Hatch Steps:</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-start">{hatchSteps}</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-end">Abilities:</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-start">{abilities}</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-end">Evs:</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-start">{evs}</h6>
                  </div>
                </div>
              </div>
            </div>

            <hr />
            <h5 className="card-title text-center">
              <b>Evolution Chain</b>
            </h5>
            <hr />
            <div className="row align-items-center">
              {evoData.map((ele) => {
                return (
                  <div className="col-md-4 text-center" key={ele.id}>
                    {imageLoading1 ? (
                      <>
                        <img
                          src={loader}
                          style={{ width: "3em", height: "3em" }}
                          id="poke"
                          className="card-img-top rounded mx-auto mt-4"
                          alt="pokemon Images"
                        ></img>
                        <br />
                        <br />
                        <span className="text-danger">
                          <b>Loading</b>
                        </span>
                      </>
                    ) : null}
                    <StyledLink
                      to={{
                        pathname: `/pokemon/${ele.id}`,
                      }}
                      state={{
                        index: { pokemonIndex: ele.id },
                      }}
                    >
                      <Sprite
                        className="card-img-top rounded mx-auto mt-2 image-fluid"
                        onLoad={() => setImageLoading1(() => false)}
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${ele.id}.png`}
                        style={
                          imageLoading1
                            ? { display: "none" }
                            : { display: "block" }
                        }
                        key={ele.id}
                      ></Sprite>
                      <br />
                      <span className="evoNames">
                        {ele.name
                          .toLowerCase()
                          .split("-")
                          .map(
                            (string) =>
                              string.charAt(0).toUpperCase() +
                              string.substring(1)
                          )
                          .join(" ")}
                      </span>
                    </StyledLink>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="card-footer text-center ">
            Data From{" "}
            <a href="https://pokeapi.co/" target="_blank" className="card-link">
              PokeAPI.co
            </a>
          </div>
        </div>
        {/* </div> */}
      </div>
    </>
  );
}
