chrome.runtime.sendMessage({'subject': 'getAllCategories'}, async function(response) {
	console.log(response);
	setupCategories(response.categories);
});

function setupCategories(categories) {
	categories.forEach(function(category) {
		var categoryElement = document.createElement('label');
		categoryElement.innerHTML += category.name;

		var element = document.createElement('input');
		element.type = 'radio';
		element.name = 'category';
		element.value = category.id;
		element.id = 'category-' + category.id;
		element.autocomplete = 'off';
		categoryElement.appendChild(element);

		document.getElementById('all-categories').appendChild(categoryElement);
	});
}
