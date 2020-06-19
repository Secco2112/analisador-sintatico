class Parser{

    constructor() {
        this.MIN_SENTENCE_SIZE = 5;
        this.MAX_SENTENCE_SIZE = 30;
        this.STEP_TIMEOUT = 1000;

        this.parser_config = {};
        this.parser_counter = 0;
        this.parser_symbol_counter = 0;
        this.sentence = "";
        this.symbol = "";
        this.state = "S";
        this.parse_finish = false;
        this.is_mark = false;
        this.old_match = "";
    }

    setMinimalSentenceSize(size) {
        this.MIN_SENTENCE_SIZE = size;
        return this;
    }

    setMaximumSentenceSize(size) {
        this.MAX_SENTENCE_SIZE = size;
        return this;
    }

    setParserConfig(config) {
        this.parser_config = config;
        return this;
    }

    getParserConfig() {
        return this.parser_config;
    }

    generateRandomSentence() {
        var valid = true,
            sentence = "S";
        while(valid) {
            for(var i=0; i<sentence.length; i++) {
                if(sentence[i] == sentence[i].toUpperCase()) {
                    var length = Object.keys(this.parser_config[sentence[i]]).length;
                    var random = Math.floor( ( Math.random() * length ) + 1 );
                    var rule = this.parser_config[sentence[i]][random];
                    sentence = sentence.replace(sentence[i], rule);
                } else {
                    valid = false;
                }
            }
        }

        if(sentence.length < this.MIN_SENTENCE_SIZE || sentence.length > this.MAX_SENTENCE_SIZE) {
            return this.generateRandomSentence();
        }
        return sentence;
    }

    buildSentenceLine() {
        $(".sentence_items").empty();
        for (var i=0; i<this.sentence.length; i++) {
            var item = "<li class='sentence_item' id='symbol" + i + "'><a>" + this.sentence[i] +  "</a></li>";
            $(".sentence_items").append(item);
        }
        return this;
    }

    parse() {
        var state = this.state[this.state.length-1],
            symbol = this.sentence[0],
            line = "<tr><td>$" + this.state + "</td><td>" + this.sentence + "$</td>";

            this.parser_counter++;

        if(state == symbol) {
            this.state = this.state.substring(0, this.state.length-1);
            this.sentence = this.sentence.substring(1, this.sentence.length);

            if(state == null) {
                line += "<td>OK em " + this.parser_counter + " iterações" +"</td> </tr>";
                this.parse_finish = true;
            } else {
                line += "<td>lê " + symbol + "</td></tr>";
                $("#symbol" + this.parser_symbol_counter + " a").addClass("highlight");
                this.parser_symbol_counter++;
            }
        } else {
            var match = state + symbol;

            if(match != null) {
                var id = $("#" + match).text();

                if(this.is_mark) {
                    $("#" + this.old_match).removeClass("highlight");
                }

                $("#" + match).addClass("highlight");
                this.old_match = match;
                this.is_mark = true;

                if(id.length == 0) {
                    line += "<td>Erro em " + this.parser_counter + "</td> </tr>";

                    $("#symbol" + this.parser_symbol_counter + " a").addClass("highlight");

                    this.parser_symbol_counter++;

                    this.parse_finish = true;
                } else {
                    var splitted = id.split("->");

                    if(splitted.length == 2) {
                        var valid = splitted[1],
                            reverse = valid.split("").reverse().join("");

                        if(reverse == "E") reverse = "";

                        this.state = this.state.substr(0, this.state.length-1);
                        this.state += reverse;

                        line += "<td>" + id + "</td></tr>";
                    }
                }
            }
        }

        $(".parser_table .parsed_table tbody").append(line);
        // Scroll para final da página
        if($(".left_content").height() == $(".parser_table .wrapper").height()) {
            $("html, body").animate({ scrollTop: $(document).height() }, 200);
        }
    }

    reset() {
        this.parser_counter = 0;
        this.parser_symbol_counter = 0;
        this.sentence = "";
        this.symbol = "";
        this.state = "S";
        this.parse_finish = false;
        this.is_mark = false;
        this.old_match = "";
    }

}