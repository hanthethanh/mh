# MH - Minimalistic Haml for Javascript

This is a very simple Javascript helper I use to make my Javascript code easier to read when I have to generate some HTML fragment.

To use it in browser:

    <script type="text/javascript" src="mh.js"></script>

To use it with node.js:

    var mh = require ('./mh.js');

It's easiest to describe what it does by examples.

    // plain JS
    "<div></div>"

    // MH
    mh.html("div")


    // plain JS
    "<div id='abc' class='classA classB'></div>"

    // MH
    mh.html("div#abc.classA.classB")


    // plain JS
    "<div><span>abc</span></div>"

    // MH
    mh.html("div",
            "  span",
            "    abc",
            "")  // ending empty string helps us to forget
                 // whether to put ending comma in relevant lines


    // plain JS
    "<div id='" + id + "' class='" + classA + " " + classB + "' style='display:" + display + ";'>" +
        "<span class='" + classC + "'> +
            text +
        "</span>" +
    "</div>"


    // MH
    mh.html("div" + mh.strIn("#%.%.% style='display:%;'", id, classA, classB, display),
            "  span." + classC,
            "    \0" + text,        // \0 means: treat this line as is, ie no translation
            "")
