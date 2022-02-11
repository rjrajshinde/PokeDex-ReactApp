import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import pokemonData from "../../search-data.json";
import "../../css/Search.css";
import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #000;
  &:hover,
  &:active {
    color: #000;
  }
`;

const StyledLi = styled.li`
  padding: 0.5em 1.3em;
  color: #000;
  &:hover {
    background-color: #d3d3d3;
    text-decoration: none;
  }
  transition: ease-out 0.2s;
`;

function Search(props) {
  const [name, setName] = useState("");

  //todo filter the data from pokemonData with the input from search bar
  let filtered = pokemonData.filter((item) => item.name.includes(name));

  const handleChange = (e) => {
    setName(e.target.value.toLowerCase());
  };

  return (
    <div>
      <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header className="bg-primary text-white" closeButton>
          Search for your Favourite Pokemon
        </Modal.Header>
        <Modal.Body className="bg-danger">
          <input
            id="search"
            type="search"
            value={name}
            placeholder="Search a Pokemon by name..."
            onChange={handleChange}
            autoComplete="off"
          />
        </Modal.Body>
        {name && (
          <div>
            {filtered.length !== 0 ? (
              <ul className="list">
                {filtered.map((item) => (
                  <StyledLink
                    key={item.id}
                    to={{
                      pathname: `/pokemon/${item.id}`,
                    }}
                    state={{
                      index: { pokemonIndex: item.id },
                    }}
                  >
                    <StyledLi>
                      {item.name
                        .toLowerCase()
                        .split("-")
                        .map(
                          (string) =>
                            string.charAt(0).toUpperCase() + string.substring(1)
                        )
                        .join(" ")}
                    </StyledLi>
                  </StyledLink>
                ))}
              </ul>
            ) : (
              <ul className="list">
                <StyledLi style={{ color: "red" }}>
                  No POKEMON Found! Try again Buddy &#128513;
                </StyledLi>
              </ul>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Search;
