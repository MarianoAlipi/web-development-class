/*
for removing elements could be this way
let element_to_delete = document.querySelector("selector").lastElementChild;
element_to_delete.parentNode.removeChild(element_to_delete);
or we could use ChildNode.remove()
https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove
*/

let total_price = 0.00;

function update_total() {
    document.querySelector('#total').innerHTML = "$ " + total_price.toFixed(2);
}

let remove_item = (element_to_delete) => {

    let str = element_to_delete.innerHTML;
    let index = str.indexOf("price: ");
    let price = parseFloat(str.substring(index + 7));

    if (!isNaN(price)) {
        total_price -= price;
        update_total();
    }

    element_to_delete.remove();
}

function get_element_li (name, price) {
    
    let template = document.createElement('li');
    template.className = "added-item";

    // If a price is invalid, mark it.
    if (price < 0 || isNaN(price)) {
        template.classList.add("invalid-item");
        price = "<span class='invalid-price'>" + price + " (not counted)</span>";
    }

    template.innerHTML = "<div class='item-details'>name: <strong>" + name + "</strong> price: " + price + "</div>  <button class=\"remove-item\">remove</button>";

    return template;
}

let add_item_to_list_with_template = () => {
    return (event) => {
        
        let name = document.querySelector('#item-name').value.trim();
        let price = document.querySelector('#item-value').value.trim();

        document.querySelector('#item-name').value = "";
        document.querySelector('#item-value').value = "";

        // If any of the fields is empty, don't add it.
        if (name === "" || price === "") {
            return;
        }

        document.querySelector('#items-list').appendChild(get_element_li(name, price));

        if (!isNaN(price) & price >= 0) {
            total_price += parseFloat(price.trim());
            update_total();
        }

        let new_item = document.querySelector('#items-list').lastElementChild;
        new_item.querySelector('.remove-item').addEventListener('click', (event) => remove_item(new_item));
    }
}