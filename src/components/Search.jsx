import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Search({ pokemon, setPokemon, setPokemonChosen, pokemonChosen }) {
  const [localPokemonName, setLocalPokemonName] = useState("");

  const searchPokemon = (name) => {
    const query = name || localPokemonName; 
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${query}`)
      .then((response) => {
        const speciesUrl = response.data.species.url;
        setPokemon({
          name: response.data.name || "Unknown name",
          height: response.data.height || "Unknown height",
          weight: response.data.weight || "Unknown weight",
          img: response.data.sprites.front_default || "No image available",
          id: response.data.id || "Unknown ID",
          types: response.data.types.map((typeSlot) => typeSlot.type.name) || ["Unknown types"],
          evolution: [],
          flavorText: "",
        });
        setPokemonChosen(true);

        return axios.get(speciesUrl);
      })
      .then((speciesResponse) => {
        const flavorEntry = speciesResponse.data.flavor_text_entries.find(
          (entry) => entry.language.name === "en"
        );
        const flavorText = flavorEntry ? flavorEntry.flavor_text.replace(/[\n\f]/g, " ") : "No description available.";
  
        setPokemon((prevPokemon) => ({
          ...prevPokemon,
          flavorText,
        }));

        const evolutionChainUrl = speciesResponse.data.evolution_chain.url;
        return axios.get(evolutionChainUrl);
      })
      .then((evolutionResponse) => {
        const evolutionChain = evolutionResponse.data.chain;
        const evolutionPromises = [];

        const fetchEvolutionData = (evolution) => {
          if (evolution.species) {
            evolutionPromises.push(
              axios.get(`https://pokeapi.co/api/v2/pokemon/${evolution.species.name}`)
                .then((evolutionPokemonResponse) => ({
                  name: evolution.species.name.charAt(0).toUpperCase() + evolution.species.name.slice(1),
                  img: evolutionPokemonResponse.data.sprites.front_default || "No image available",
                }))
            );
          }
          if (evolution.evolves_to.length > 0) {
            evolution.evolves_to.forEach((nextEvolution) => fetchEvolutionData(nextEvolution));
          }
        };

        fetchEvolutionData(evolutionChain);
        return Promise.all(evolutionPromises);
      })
      .then((evolutionData) => {
        setPokemon((prevPokemon) => ({
          ...prevPokemon,
          evolution: evolutionData,
        }));
      })
      .catch((error) => {
        console.error("Error fetching the Pokémon data:", error);
        setPokemonChosen(false);
      });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      searchPokemon();
    }
  };

  const handleLeftArrowClick = () => {
    const id = parseInt(pokemon.id) - 1;
    if (id < 1) {
      return;
    }
    searchPokemon(id);
  }

  const handleRightArrowClick = () => {
    const id = parseInt(pokemon.id) + 1;
    if (id > 1025){
      return;
    }
    searchPokemon(id);
  }

  useEffect(() => {
    searchPokemon("1");
  }, []);

  return (
    <div className="search-container">
      {pokemonChosen && (
        <div className="main-screen-container">
          <div className="main-screen">
            <div className="pokemon-img-container">
              <img className="pokemon-img" src={pokemon.img} alt={pokemon.name} />
              </div>
            <p className="pokemon-traits">
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}<br />
              Height: {pokemon.height} cm <br /><br />
              Weight: {pokemon.weight} g <br /><br />
              Types: {pokemon.types.map((type, index) => (
                <span key={index}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                  {index < pokemon.types.length - 1 ? ", " : ""}
                </span> ))} <br /><br />
                </p>
                <div className="flavor-Text">
                  {pokemon.flavorText}
              </div>
            
          </div>
        </div>
      )}
      <div className="controls"> 
      <input
        className="search-bar"
        type="text"
        onChange={(event) => setLocalPokemonName(event.target.value.toLowerCase())}
        onKeyPress={handleKeyPress}
      />
      <button className="search-button "onClick={() => searchPokemon()}>Search</button>
      <div className="arrow-pad">
        <button className="arrow-button up"  aria-label="Up">&#8679;</button> {/* ↑ */}
        <button className="arrow-button down"  aria-label="Down">&#8681;</button> {/* ↓ */}
        <button className="arrow-button left" onClick={handleLeftArrowClick} aria-label="Left">&#8678;</button> {/* ← */}
        <button className="arrow-button right" onClick={handleRightArrowClick} aria-label="Right">&#8680;</button> {/* → */}
      </div>


      </div>
    </div>
  );
}
