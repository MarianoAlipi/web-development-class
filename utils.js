/*
for removing elements could be this way
let element_to_delete = document.querySelector("selector").lastElementChild;
element_to_delete.parentNode.removeChild(element_to_delete);
or we could use ChildNode.remove()
https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove
*/

let remove_item = (element_to_delete) => {
    element_to_delete.remove();
    
}

function get_element_li (name, price) {
    // return `<li class="added-item">name: ${name} price: ${price}  <button class="remove-item">remove</button></li>`
    let template = document.createElement('li');
    template.className = "added-item";
    template.innerHTML = "name: " + name + " price: " + price + "  <button class=\"remove-item\">remove</button>";

    return template;
}

let add_item_to_list_with_template = () => {
    return (event) => {
        /*
        add the item to the list
        add event listener to the button inside the element just added with the remove_item function
        add the value to the total
        */
        
        let name = document.querySelector('#item-name').value;
        let price = document.querySelector('#item-value').value;

        document.querySelector('#items-list').appendChild(get_element_li(name, price));

        let new_item = document.querySelector('#items-list').lastElementChild;
        new_item.querySelector('.remove-item').addEventListener('click', (event) => remove_item(new_item));
    }
}