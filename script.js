document.addEventListener('DOMContentLoaded', () => {
    const craftingList = document.getElementById('crafting-list');
    const searchInput = document.getElementById('search-input');
    const categorySelect = document.getElementById('category-select');
    const modal = document.getElementById('modal');
    const modalImages = document.getElementById('modal-images');
    const closeModal = document.querySelector('.close');

    let craftingData = [];

    // Cargar los datos del archivo JSON
    fetch('craftingData.json')
        .then(response => response.json())
        .then(data => {
            craftingData = data;
            displayCraftingItems(craftingData);
            populateCategoryOptions(craftingData);
        });

    // Función para mostrar los ítems de crafting
    function displayCraftingItems(items) {
        craftingList.innerHTML = '';

        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('item');

            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <h2>${item.name}</h2>
                <p>${item.category || ''}</p>
            `;

            // Agregar evento click para abrir el modal con los materiales
            itemElement.addEventListener('click', () => {
                openModal(item.materials);
            });

            craftingList.appendChild(itemElement);
        });
    }

    // Función para abrir el modal y mostrar los materiales
    function openModal(materials) {
        modalImages.innerHTML = '';

        materials.forEach(material => {
            const materialElement = document.createElement('div');
            materialElement.classList.add('material');

            materialElement.innerHTML = `
                <img src="${material.image}" alt="${material.name}">
                <p>${material.name}</p>
            `;

            modalImages.appendChild(materialElement);
        });

        modal.style.display = 'flex';
    }

    // Cerrar el modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Cerrar el modal si se hace clic fuera del contenido
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Filtrar ítems de crafting por búsqueda de texto
    searchInput.addEventListener('input', () => {
        const searchText = searchInput.value.toLowerCase();
        const filteredItems = craftingData.filter(item =>
            item.name.toLowerCase().includes(searchText) ||
            item.category.toLowerCase().includes(searchText)
        );
        displayCraftingItems(filteredItems);
    });

    // Filtrar ítems de crafting por categoría
    categorySelect.addEventListener('change', () => {
        const selectedCategory = categorySelect.value;
        const filteredItems = selectedCategory === ''
            ? craftingData
            : craftingData.filter(item => item.category === selectedCategory);
        displayCraftingItems(filteredItems);
    });

    // Poblar el select de categorías con opciones únicas
    function populateCategoryOptions(items) {
        const categories = [...new Set(items.map(item => item.category))];
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }
});
