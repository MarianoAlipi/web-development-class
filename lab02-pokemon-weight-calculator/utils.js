let total_price = 0.00;

function update_total() {
    document.querySelector('#total').innerHTML = total_price.toFixed(2);
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

    template.innerHTML = "<div class='list-item'><div class='item-details'>name: <strong>" + name + "</strong> weight: " + weight + "</div>  <button class=\"remove-item\">remove</button></div>";

    return template;
}

let add_item_to_list_with_template = () => {
    return (event) => {
        
        let name = document.querySelector('#item-name').value.trim();

        document.querySelector('#pokemon-name').value = "";

        document.querySelector('#pokemon-name').focus();
        document.querySelector('#pokemon-name').select();

        // If any of the fields is empty, don't add it.
        if (name === "") {
            return;
        }

        document.querySelector('#pokemon-list').appendChild(get_element_li(name, weight));

        if (!isNaN(weight) & weight >= 0) {
            total_weight += parseFloat(weight.trim());
            update_total();
        }

        let new_item = document.querySelector('#pokemon-list').lastElementChild;
        new_item.querySelector('.remove-item').addEventListener('click', (event) => remove_item(new_item));
    }
}