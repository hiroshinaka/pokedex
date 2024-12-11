import React, { useState } from "react";
import Search from "./Search";
import "./pokedex.css";

export default function Pokedex() {
  const [pokemon, setPokemon] = useState({
    name: "",
    species: "",
    height: "",
    weight: "",
    img: "",
    evolution: [],
  });
  const [pokemonChosen, setPokemonChosen] = useState(false);

  return (
    <div className="pokedex-Base">
      {/* Header Section */}
      <div className="header-rect-left">
        <div className="buttons">
          <div className="button blue-button"><div className="button-inner"></div></div>
          <div className="button red-button"><div className="button-inner"></div></div>
          <div className="button green-button"><div className="button-inner"></div></div>
          <div className="button yellow-button"><div className="button-inner"></div></div>
        </div>
        <div className="rectangle-left"></div>

      </div>
      <div className="header-rect-right">
        <div className="rectangle-right"></div>
      </div>

      {/* Left Section */}
      <div className="pokedex-Base-left">
        <Search
          pokemon={pokemon}
          setPokemon={setPokemon}
          setPokemonChosen={setPokemonChosen}
          pokemonChosen={pokemonChosen}
        />
      </div>

      {/* Right Section */}
      <div className="pokedex-Base-right">
        <div className={pokemon.evolution.length > 1 ? "evolution-screen" : "evolution-screen-no-evolution"}>
          {pokemonChosen && pokemon.evolution.length === 1 ? (
            <p> No Evolutions Available</p>
          ) :(
            pokemon.evolution.map((evo, index) => (
              <React.Fragment key={index}>
                <div>
                  <img className="pokemon-Img" src={evo.img} alt={evo.name} />
                  <p>{evo.name}</p>
                </div>
                {index < pokemon.evolution.length - 1 && (
                  <div className="evolution-arrow">→</div> 
                )}
              </React.Fragment>
            ))

        )
      }
        </div>

        <div className="blue-buttons">
                <div className="blue-button-row">
                  <button className="blue-button-shiny"></button>
                  <button className="blue-button-shiny"></button>
                  <button className="blue-button-shiny"></button>
                  <button className="blue-button-shiny"></button>
                  <button className="blue-button-shiny"></button>
                </div>
                <div className="blue-button-row">
                  <button className="blue-button-shiny"></button>
                  <button className="blue-button-shiny"></button>
                  <button className="blue-button-shiny"></button>
                  <button className="blue-button-shiny"></button>
                  <button className="blue-button-shiny"></button>
                </div>
              </div>
      </div>
      <div className="pokedex-hinge"></div>
    </div>
  );
}
