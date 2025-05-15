const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const creatureName = document.getElementById('creature-name');
const creatureId = document.getElementById('creature-id');
const weight = document.getElementById('weight');
const height = document.getElementById('height');
const types = document.getElementById('types');
const hp = document.getElementById('hp');
const attack = document.getElementById('attack');
const defense = document.getElementById('defense');
const specialAttack = document.getElementById('special-attack');
const specialDefense = document.getElementById('special-defense');
const speed = document.getElementById('speed');

const API_URL = 'https://rpg-creature-api.freecodecamp.rocks/api/creature/';

async function searchCreature(searchTerm) {
    try {
        const response = await fetch(API_URL + searchTerm.toLowerCase());
        
        if (!response.ok) {
            throw new Error('Creature not found');
        }
        
        const data = await response.json();
        
        // Update UI with creature data
        creatureName.textContent = data.name.toUpperCase();
        creatureId.textContent = `#${data.id}`;
        weight.textContent = `Weight: ${data.weight}`;
        height.textContent = `Height: ${data.height}`;
        
        // Clear and update types
        types.innerHTML = '';
        data.types.forEach(type => {
            const typeElement = document.createElement('div');
            typeElement.textContent = type.name.toUpperCase();
            types.appendChild(typeElement);
        });
        
        // Update stats
        data.stats.forEach(stat => {
            const statElement = document.getElementById(stat.name);
            if (statElement) {
                statElement.textContent = stat.base_stat;
            }
        });
        
    } catch (error) {
        // Clear all fields
        creatureName.textContent = '';
        creatureId.textContent = '';
        weight.textContent = '';
        height.textContent = '';
        types.innerHTML = '';
        hp.textContent = '';
        attack.textContent = '';
        defense.textContent = '';
        specialAttack.textContent = '';
        specialDefense.textContent = '';
        speed.textContent = '';
        
        alert('Creature not found');
    }
}

searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        searchCreature(searchTerm);
    }
});