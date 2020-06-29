var parser = new Parser();
parser.setParserConfig({
    "S": {
        1: "aBc",
        2: "cCb"
    },
    "A": {
        1: "bCc",
        2: "cB"
    },
    "B": {
        1: "aC",
        2: "baA",
        3: ""
    },
    "C": {
        1: "aAc",
        2: "caS"
    }
});

$(document).ready(function() {
    generate_random_sentence();
    slider_sentence_size();
    not_step_parser();
    step_parser();
    reset();
});



function generate_random_sentence() {
    $(".generate_random_sentence").on("click", function() {
        var random_sentence = parser.generateRandomSentence();
        parser.sentence = random_sentence;
        $(this).parent().find("input").val(random_sentence);
    });
}


function slider_sentence_size() {
    $("#slider_sentence_size").slider({
        range: true,
        min: 5,
        max: 50,
        values: [5, 20],
        create: function() {
			$("#slider_sentence_size span").eq(0).attr("data-content", 5);
			$("#slider_sentence_size span").eq(1).attr("data-content", 20);
        },
        slide: function( event, ui ) {
			if(ui.values[1] == ui.values[0]) {
				return false;
			}
			var values = ui.values,
				v1 = values[0],
				v2 = values[1];

			$("#slider_sentence_size span").eq(0).attr("data-content", v1);
            $("#slider_sentence_size span").eq(1).attr("data-content", v2);
            
            parser.MIN_SENTENCE_SIZE = v1;
            parser.MAX_SENTENCE_SIZE = v2;
		}
    });
}


function not_step_parser() {
    var first_it = true;

    function direct_parser() {
        if(first_it) {
            parser.sentence = $("input#sentence").val();
            parser.buildSentenceLine();

            $("input#sentence").attr("disabled", "disabled");
            $(".btn-direct").attr("disabled", "disabled");
            $(".btn-step-by-step").attr("disabled", "disabled");
            $(".btn-next-step").removeClass("active").attr("disabled", "disabled");

            first_it = false;
        }

        parser.parse();

        if(parser.parse_finish == false) {
            setTimeout(direct_parser, parser.STEP_TIMEOUT);
        }
    }

    $(".btn-direct").on("click", function() {
        first_it = true;

        Swal.fire({
            title: 'Tempo para etapa',
            text: 'Digite o tempo que cada etapa irá durar (em segundos).',
            input: 'text',
            showCancelButton: true
        }).then((handle) => {
            if(handle.isDismissed == false) {
                parser.STEP_TIMEOUT = parseFloat(handle.value) * 1000;
                direct_parser();
            }
        });
    });
}


function step_parser() {
    $(".btn-step-by-step").on("click", function() {
        parser.sentence = $("input#sentence").val();

        $("input#sentence").attr("disabled", "disabled");
        $(".btn-direct").attr("disabled", "disabled");
        $(".btn-step-by-step").attr("disabled", "disabled");
        $(".btn-next-step").addClass("active").removeAttr("disabled").css("opacity", "1");

        parser.buildSentenceLine();

        parser.parse();

        if(parser.parse_finish) {
            $(".btn-next-step").attr("disabled", "disabled").css("opacity", "0.65");
        }
    });

    $(".btn-next-step").on("click", function() {
        parser.parse();

        if(parser.parse_finish) {
            $(this).attr("disabled", "disabled").css("opacity", "0.65");
        }
    });
}


function reset() {
    $(".btn-restart").on("click", function() {
        $("input#sentence").removeAttr("disabled").val("");
        $(".btn-direct").removeAttr("disabled");
        $(".btn-step-by-step").removeAttr("disabled");
        $(".btn-next-step").removeClass("active").attr("disabled", "disabled").css("opacity", "1");
        $("table.parsed_table tbody").empty();
        $(".sentence_items").empty();
        $(".generated-table").find("td").removeClass("highlight");
        parser.reset();
    });
}