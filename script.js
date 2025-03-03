const pokemonName = document.querySelector('.pokemon-name');
const pokemonNumber = document.querySelector('.pokemon-number');
const pokemonImage = document.querySelector('.pokemon-image');

const form = document.querySelector('.form');
const input = document.querySelector('.input-search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');

const autocompleteSuggestions = document.querySelector('.autocomplete-suggestions');

let searchPokemon = 1;

const fetchPokemon = async (pokemon) => {
  const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

  if (APIResponse.status === 200) {
    const data = await APIResponse.json();
    return data;
  }
}

const fetchPokemonNames = async (query) => {
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`);
    if (APIResponse.status === 200) {
      const data = await APIResponse.json();
      return data.results.filter(pokemon => pokemon.name.startsWith(query));
    }
    return [];
};
  

const fetchPokemonSpecies = async (pokemonId) => {
  const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
  if (APIResponse.status === 200) {
    const data = await APIResponse.json();
    return data;
  }
}

const showAutocompleteSuggestions = async (query) => {
    if (!query) {
      autocompleteSuggestions.innerHTML = '';
      return;

    }
    const pokemonNames = await fetchPokemonNames(query);
    autocompleteSuggestions.innerHTML = pokemonNames
    .map(pokemon => `<li>${pokemon.name}</li>`)
    .join('');

    autocompleteSuggestions.querySelectorAll('li').forEach(item => {
        item.addEventListener('click', () => {
            input.value = item.textContent;
            autocompleteSuggestions.innerHTML = '';
            renderPokemon(item.textContent.toLowerCase());
    });
  });
};

const renderPokemon = async (pokemon) => {
  pokemonName.innerHTML = 'Chargement...';
  pokemonNumber.innerHTML = '';
  pokemonImage.style.display = 'none';

  const data = await fetchPokemon(pokemon);
  const speciesData = await fetchPokemonSpecies(data.id);

  if (data) {
    const frenchName = speciesData.names.find(name => name.language.name === 'fr');
    
    const pokemonNameToDisplay = frenchName ? frenchName.name : data.name;

    pokemonImage.style.display = 'block';
    pokemonName.innerHTML = pokemonNameToDisplay; 
    pokemonNumber.innerHTML = data.id;
    pokemonImage.src = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];
    input.value = '';
    searchPokemon = data.id;
  } else {
    pokemonImage.style.display = 'none';
    pokemonName.innerHTML = 'Introuvable';
    pokemonNumber.innerHTML = '';
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  renderPokemon(input.value.toLowerCase());
});

buttonPrev.addEventListener('click', () => {
  if (searchPokemon > 1) {
    searchPokemon -= 1;
    renderPokemon(searchPokemon);
  }
});

buttonNext.addEventListener('click', () => {
  searchPokemon += 1;
  renderPokemon(searchPokemon);
});

input.addEventListener('input', (event) => {
    showAutocompleteSuggestions(event.target.value.toLowerCase());
});
  
input.addEventListener('focus', () => {
    if (input.value) {
      showAutocompleteSuggestions(input.value);
    }
});
  
  input.addEventListener('blur', () => {
    setTimeout(() => autocompleteSuggestions.innerHTML = '', 200);
});

renderPokemon(searchPokemon);
