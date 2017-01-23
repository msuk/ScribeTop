$(window).on('load', function(){
    $('#modalPopUp').modal('show');
});

// Set up editors
var htmlEditor = CodeMirror.fromTextArea(document.getElementById("htmlPanel"), {
    lineNumbers: true,
    lineWrapping: true,
    mode: "xml",
    theme: "solarized"
});

var cssEditor = CodeMirror.fromTextArea(document.getElementById("cssPanel"), {
    lineNumbers:true,
    lineWrapping: true,
    mode: "css",
    theme: "solarized"
});

var jsEditor = CodeMirror.fromTextArea(document.getElementById("jsPanel"), {
    lineNumbers: true,
    lineWrapping: true,
    mode:  "javascript",
    theme: "solarized"
});

htmlEditor.refresh();
cssEditor.refresh();
jsEditor.refresh();

// Changing Style of CodeMirror defaults
$(".CodeMirror").css("color", "#95A3A3");
$(".CodeMirror").css("font-family","'Source Code Pro', 'Oxygen Mono', monospace");
$(".CodeMirror").css("background-color", "#002B36");
$(".CodeMirror").css("overflow-wrap", "break-word");

var htmlcssValue = "";
var htmlValue = "";
var cssValue = "";
var jsValue= "";

function updateOutput() {
    htmlcssValue = "<html><head><style>" + cssValue + "</style></head></html><body>" + htmlValue + "</body></html>";
    $("iframe").contents().find("html").html(htmlcssValue);
    document.getElementById("outputPanel").contentWindow.eval(jsValue);
}

$("textarea").on('change keyup paste', function() {
    htmlValue = htmlEditor.getValue();
    cssValue = cssEditor.getValue();
    jsValue = jsEditor.getValue();
    updateOutput();
});

$("#output").height($(window).height() - $("#top-toolbar").height() - $("#codePanel").height() - $("#bottom-toolbar").height());
$("#term_demo").height($(window).height() - $("#top-toolbar").height() - $("#codePanel").height() - $("#bottom-toolbar").height());

// Returns the column width
function checkColLen(numActive) {
    return 12 / numActive;
}

function addActiveId(idVal) {
    $(idVal).removeClass("col-md-" + (checkColLen($("span.nav-link.active").length)));
    $(idVal).addClass("col-md-" + (checkColLen($("span.nav-link.active").length + 1)));
}

function removeActiveId(idVal) {
    $(idVal).removeClass("col-md-" + (checkColLen($("span.nav-link.active").length)));
    $(idVal).addClass("col-md-" + (checkColLen($("span.nav-link.active").length - 1)));
}

// Updates the column widths based on selected tabs
function fixActive() {
    if ($("#htmlTab").hasClass("active") && $("#cssTab").hasClass("active")) {
        addActiveId("#html");
        addActiveId("#css");
    } else if ($("#htmlTab").hasClass("active") && $("#jsTab").hasClass("active")) {
        addActiveId("#html");
        addActiveId("#js");
    } else if ($("#cssTab").hasClass("active") && $("#jsTab").hasClass("active")) {
        addActiveId("#css");
        addActiveId("#js");
    } else if ($("#htmlTab").hasClass("active")) {
        addActiveId("#html");
    } else if ($("#cssTab").hasClass("active")) {
        addActiveId("#css");
    } else {
        addActiveId("#js");
    }
}

function fixRemove(idVal) {
    if ($("span.nav-link.active").length == 3) {
        if (idVal == "#html") {
            $("#html").removeClass("col-md-4");
            removeActiveId("#css");
            removeActiveId("#js");
        } else if (idVal == "#css") {
            $("#css").removeClass("col-md-4");
            removeActiveId("#html");
            removeActiveId("#js");
        } else {
            $("#js").removeClass("col-md-4");
            removeActiveId("#html");
            removeActiveId("#css");
        }
    } else {
        if (idVal == "#html") {
            $("#html").removeClass("col-md-6");
            if ($("#cssTab").hasClass("active")) {
                removeActiveId("#css");
            } else {
                removeActiveId("#js");
            }
        } else if (idVal == "#css") {
            $("#css").removeClass("col-md-6");
            if ($("#htmlTab").hasClass("active")) {
                removeActiveId("#html");
            } else {
                removeActiveId("#js");
            }
        } else {
            $("#js").removeClass("col-md-6");
            if ($("#htmlTab").hasClass("active")) {
                removeActiveId("#html");
            } else {
                removeActiveId("#css");
            }
        }
    }
}

// Playing with the Toggling
$(".nav-link").click(function() {
    //Will no longer be active once clicking
    if ($(this).hasClass("active") && $("span.nav-link.active").length > 1) {
        var id = $(this).attr("href");
        fixRemove(id);
        //$(id).removeClass("col-md-" + (checkColLen($("span.nav-link.active"))));
        $(this).removeClass("active");                      // the tab id
        $(id).removeClass("active");                        // the panel id
    } else if ($("span.nav-link.active") == 1) {
        fixActive();
        $(this).addClass("active");
        var id = $(this).attr("href");
        $(id).addClass("active");
        $(id).addClass("col-md-" + checkColLen($("span.nav-link.active").length));
    } else {
        fixActive();
        $(this).addClass("active");
        var id = $(this).attr("href");
        $(id).addClass("active");
        $(id).addClass("col-md-" + checkColLen($("span.nav-link.active").length));
    }
});

// Saving files
$("#exportButton").click(function() {
    var htmlBlob = new Blob([htmlValue], {type:"text/plain;charset=utf-8"});
    var cssBlob = new Blob([cssValue], {type:"text/plain;charset=utf-8"});
    var jsBlob = new Blob([jsValue], {type:"text/plain;charset=utf-8"});
    var filename = "sample";
    saveAs(htmlBlob, filename + ".html");
    saveAs(cssBlob, filename + ".css");
    saveAs(jsBlob, filename + ".js");
});

// Console
$(function($, undefined) {
    $('#term_demo').terminal(function(command, term) {
        if (command !== '') {
            try {
                var result = window.eval(command);
                if (result !== undefined) {
                    term.echo(new String(result));
                }
            } catch(e) {
                term.error(new String(e));
            }
        } else {
           term.echo('');
        }
    }, {
        greetings: '',
        name: 'js_demo',
        prompt: 'js> '
    });
});


// Console/Output Toggling
$("#consoleButton").click(function() {
    $("#consoleButton").addClass("active");
    $("#outputPanel").removeClass("col-md-12");
    $("#outputPanel").css("display", "none");
    $("#outputButton").removeClass("active");
    $("#term_demo").css("display", "block");
    $("#term_demo").addClass("col-md-12");
});

$("#outputButton").click(function() {
    $("#outputButton").addClass("active");
    $("#term_demo").removeClass("col-md-12");
    $("#term_demo").css("display", "none");
    $("consoleButton").removeClass("active");
    $("#outputPanel").css("display", "block");
    $("#outputPanel").addClass("col-md-12");
    
});
        
