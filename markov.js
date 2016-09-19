function markov() {
    input = document.getElementById("input-text").value;
    chain_len = parseInt(document.getElementById("input-chain-len").value);
    parse_on = document.getElementById("input-parse-on").value
    num_output_chars = parseInt(document.getElementById("input-num-chars").value);

    var table;
    if(parse_on == "word") {
	   table = create_table_on_words(input, chain_len);
       console.log(table);
    }
    else {
	   table = create_table_on_letters(input, chain_len);
    }

    output = generate_text(table, parse_on, num_output_chars, chain_len);

    generated_text_box = document.getElementById("generated-text");
    generated_text_box.style.display = "block";
    generated_text_box.value = output;
}

function create_table_on_words(input, chain_len) {
    var table = {};
    words = input.split(" ");

    for(var i = 0; i < words.length-chain_len; i++) {
        chain = words.slice(i, i+chain_len).join("|");
        after = words.slice(i+chain_len, i+(2*chain_len)).join("|");

        if(!table[chain]) {
            table[chain] = {};
        }

        if(!table[chain][after]) {
            table[chain][after] = 1;
        }
        else {
            table[chain][after]++;
        }
    }

    return table;
}

function create_table_on_letters(input, chain_len) {
    var table = {};

    for(var i = 0; i < input.length; i++) {
    	chain = input.substr(i, chain_len);
    	after = input.substr(i+chain_len, chain_len);

    	if(!table[chain]) {
    	    table[chain] = {};
    	}

    	if(!table[chain][after]) {
    	    table[chain][after] = 1;
    	}
    	else {
    	    table[chain][after]++;
    	}
    }

    return table;
}

function generate_text(table, parse_on, num_output_chars, chain_len) {
    var keys = [];
    for(temp_key in table) {
    	if(table.hasOwnProperty(temp_key)) {
    	    keys.push(temp_key);
    	}
    }

    choice = keys[Math.floor(Math.random() * keys.length)];

    output = choice;
    if(parse_on == "word") {
        output = choice.split("|").join(" ");
        console.log(output);
    }
    for(var idx = 0; idx < num_output_chars/chain_len; idx++) {
    	new_char = get_random_next(table[choice]);
    	if(new_char) {
    	    choice = new_char;
            if(parse_on == "word") {
                output += " " + choice.split("|").join(" ");
            }
            else {
    	       output += choice;
           }
    	}
    	else {
    	    choice = table[keys[Math.floor(Math.random() * keys.length)]];
    	}
    }

    return output;
}

function get_random_next(choices) {
    total = 0;
    for(var elem in choices) {
	   total += choices[elem];
    }

    rand = Math.random() * total;

    for(var elem in choices) {
    	weight = choices[elem];
    	if(rand <= weight) {
    	    return elem;
    	}
    	rand -= weight;
    }
}