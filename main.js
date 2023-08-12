document.addEventListener('DOMContentLoaded', function() {
  const charactersBtn = document.getElementById('characters');
  const planetsBtn = document.getElementById('planets');
  const vehiclesBtn = document.getElementById('vehicles');
  const contentDiv = document.getElementById('content');

  charactersBtn.addEventListener('click', () => fetchAndDisplayData('people'));
  planetsBtn.addEventListener('click', () => fetchAndDisplayData('planets'));
  vehiclesBtn.addEventListener('click', () => fetchAndDisplayData('vehicles'));

  async function fetchAndDisplayData(category) {
    try {
        const response = await fetch(`https://swapi.dev/api/${category}/`);
        const data = await response.json();
        displayData(data.results);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

  function displayData(items) {
    contentDiv.innerHTML = '';
    items.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card', 'mb-3');

        const cardImage = document.createElement('img');
        cardImage.classList.add('card-img-top');
        cardImage.src = `images/${item.name.replace('/', '_')}.png`;
        cardImage.alt = item.name;
        
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = item.name;
        
        cardBody.appendChild(cardTitle);
        card.appendChild(cardImage);
        card.appendChild(cardBody);
        
        card.addEventListener('click', () => displayDetails(item));
        contentDiv.appendChild(card);
    });
}

async function generateTableRows(item) {
  const selectedProperties = [
      'name', 'age', 'homeworld', 'birth_year', "height", 'skin_color',  'eye_color', 'hair_color', 
      'vehicles', 'population', 'climate', 'model', 'manufacturer'
  ];

  let rows = '';
  for (const property of selectedProperties) {
      if (property === 'homeworld' && item[property]) {
          const homeworldResponse = await fetch(item[property]);
          const homeworldData = await homeworldResponse.json();
          rows += `
              <tr>
                  <td>${formatPropertyName('homeworld')}</td>
                  <td>${homeworldData.name}</td>
              </tr>
          `;
      } else if (property === 'vehicles' && item[property]) {
          const vehiclesData = await Promise.all(item[property].map(async vehicle => {
              const response = await fetch(vehicle);
              const vehicleData = await response.json();
              return vehicleData.name;
          }));

          rows += `
              <tr>
                  <td>${formatPropertyName(property)}</td>
                  <td>${vehiclesData.join(', ')}</td>
              </tr>
          `;
      } else if (item[property]) {
          rows += `
              <tr>
                  <td>${formatPropertyName(property)}</td>
                  <td>${item[property]}</td>
              </tr>
          `;
      }
  }

  return rows;
}


async function displayDetails(item) {
  contentDiv.innerHTML = `
  <div class="entity-details">
  <div class="entity-header">
      <h2>${item.name}</h2>
      <img class="entity-image" src="images/${item.name.replace('/', '_')}.png" alt="#">
  </div>
  <table>
      ${await generateTableRows(item)}
  </table>
</div>
`;
}

function formatPropertyName(name) {
  // Замінити підкреслення на пробіли та перший символ зробити великим
  return name.replace('_', ' ').replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}


});