document.addEventListener('DOMContentLoaded', () => {
    const searchTerm = document.getElementById('search-term');
    const categorySelect = document.getElementById('category-select');
    const exerciseList = document.getElementById('exercise-list');
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessage = document.getElementById('error-message');
    const noResultsMessage = document.getElementById('no-results-message');
    const resultsCounter = document.getElementById('results-counter');

    let exercises = [];
    let bodyParts = [];

    const fetchBodyParts = async () => {
        try {
            const response = await fetch('/ejercicios/bodyparts');
            if (!response.ok) {
                throw new Error('Error al cargar las categorías');
            }
            bodyParts = await response.json();
            populateCategories(bodyParts);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchExercises = async () => {
        loadingIndicator.style.display = 'block';
        errorMessage.style.display = 'none';
        exerciseList.innerHTML = '';
        try {
            const response = await fetch('/ejercicios/exercises');
            if (!response.ok) {
                throw new Error('Error al cargar los ejercicios');
            }
            exercises = await response.json();
            displayExercises(exercises);
        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        } finally {
            loadingIndicator.style.display = 'none';
        }
    };

    const populateCategories = (categories) => {
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categorySelect.appendChild(option);
        });
    };

    const displayExercises = (exercisesToDisplay) => {
        exerciseList.innerHTML = '';
        if (exercisesToDisplay.length === 0) {
            noResultsMessage.style.display = 'block';
        } else {
            noResultsMessage.style.display = 'none';
        }
        resultsCounter.textContent = `Mostrando ${exercisesToDisplay.length} ejercicios`;

        exercisesToDisplay.forEach(exercise => {
            const card = document.createElement('div');
            card.className = 'exercise-card';
            card.innerHTML = `
                <div class="exercise-gif-container">
                    <img src="${exercise.gifUrl}" alt="${exercise.name}" class="exercise-gif" loading="lazy">
                </div>
                <div class="exercise-info">
                    <h3 class="exercise-name">${exercise.name}</h3>
                    <p class="exercise-target">Músculo objetivo: <span>${exercise.target}</span></p>
                    <div class="exercise-badges">
                        <span class="badge body-part-badge">${exercise.bodyPart}</span>
                        <span class="badge equipment-badge">${exercise.equipment}</span>
                    </div>
                </div>
            `;
            exerciseList.appendChild(card);
        });
    };

    const filterExercises = () => {
        const searchTermValue = searchTerm.value.toLowerCase();
        const categoryValue = categorySelect.value;

        let filteredExercises = exercises;

        if (categoryValue !== 'all') {
            filteredExercises = filteredExercises.filter(exercise => exercise.bodyPart === categoryValue);
        }

        if (searchTermValue) {
            filteredExercises = filteredExercises.filter(exercise =>
                exercise.name.toLowerCase().includes(searchTermValue) ||
                exercise.target.toLowerCase().includes(searchTermValue) ||
                exercise.equipment.toLowerCase().includes(searchTermValue) ||
                exercise.bodyPart.toLowerCase().includes(searchTermValue)
            );
        }

        displayExercises(filteredExercises);
    };

    searchTerm.addEventListener('input', filterExercises);
    categorySelect.addEventListener('change', filterExercises);

    fetchBodyParts();
    fetchExercises();
});
