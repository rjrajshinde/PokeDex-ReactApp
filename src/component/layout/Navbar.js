import React, { useState } from "react";
import pikachuface from "../../images/pikachuface.png";
import pokeDex from "../../images/PokeDex.png";
import "../../css/Navbar.css";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

import Search from "./Search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const location = useLocation();

  const [show, setShow] = useState(false);

  //? to show the search bar
  const onToggle = () => {
    setShow(!show);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg fixed-top text-center">
        <a className="navbar-brand col-sm-3 col-md-2 mr-0 text-white" href="/">
          <img
            src={pokeDex}
            id="pokedeximg"
            className="pokedeximg"
            alt="Pikachu"
          />
          <img
            src={pikachuface}
            style={{ width: "2em", height: "3em" }}
            alt="Pikachu"
          />
        </a>
        <div className="buttons">
          <button className="btn btn-warning" type="button" onClick={onToggle}>
            <FontAwesomeIcon icon={faSearch} style={{ color: "#DC3545" }} />
          </button>
          <Search show={show} handleClose={onToggle} />
          {location.pathname.includes("pokemon") ? (
            <Link
              to={{
                pathname: "/",
              }}
            >
              <button className="btn btn-primary" type="button">
                Go Back
              </button>
            </Link>
          ) : null}
        </div>
      </nav>
    </div>
  );
}
