(function() {
    var global = this;
    var mh = {};
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = mh;
        }
        exports.mh = mh;
    } else {
        global['mh'] = mh;
    }

    var slice = Array.prototype.slice;
    var selectorPattern = /^(\s*)(h[1-6]|p|div|span|ul|ol|li|td|tr|th|table|thead|tbody|a|button|select|option)\b((?:#[^. ]+)?)((?:\.\S+)?)(.*)$/i;
    // match:               1    2                                                                      3             4           5
    // 1 indentation
    // 2 tagName
    // 3 id
    // 4 classes
    // 5 remaining, ie inline style

    var parseSelector = function(selector) {
        var m = selector.match(selectorPattern);
        if (m == null)
            return null;

        var ret = {
            indent:   m[1],
            tagName:  m[2]
        };
        if (m[3])
            ret.id = m[3].replace(/^#/, "");
        if (m[4])
            ret.className = m[4].replace(/\./g, " ").replace(/^\s+|\s+$/g, '');
        if (m[5])
            ret.remaining = m[5].replace(/\s+$/, "");

        return ret;
    };

    // simple string interpolation: strIn("abc % % %", 1, 2, 3) => "abc 1 2 3"
    var strIn = function(str) {
        var a = slice.call(arguments);
        var i = 0;
        var j = 1;
        var len = a.length;
        str = str.replace(/\0%/g, "\0"); // hack to escape %
        for(;;) {
            // no more arguments
            if (j >= len)
                break;

            // no more %
            i = str.indexOf("%", i);
            if (i == -1)
                break;

            // interpolate
            str = str.replace(/%/, a[j]);
            i += 1;
            j += 1;
        }
        return str.replace(/\0/g, "%"); // put back %
    };

    var html = function(arg) {
        var stack = [];
        var buf = [];
        if (toString.call(arg) !== '[object Array]')
            arg = slice.call(arguments);
        for (var i = 0, l = arg.length; i < l; i++) {
            var str = arg[i];
            var indent;
            var p = parseSelector(str);
            // if not an element, count indent spaces
            if (p == null) {
                indent = str.search(/\S/); // hack to count leading spaces
                if (indent === -1)
                    indent = str.length;
            }
            else
                indent = p.indent.length;

            // close & pop stack till top.indent < indent
            var topItem = stack[stack.length - 1];
            while (topItem && topItem.indent >= indent) {
                buf.push('</' + topItem.tagName + '>')
                stack.pop();
                topItem = stack[stack.length - 1];
            }

            // if not an element, treat str as raw html
            if (p == null) {
                str = str.trim();
                buf.push(str.charAt(0) === '\0' ? str.substr(1) : str);
                continue;
            }

            var html = '<' + p.tagName
                           + (p.id        ? ' id="'    + p.id        + '"'  : '')
                           + (p.className ? ' class="' + p.className + '"'  : '')
                           + (p.remaining ?              p.remaining        : '')
                           + '>';
            stack.push({
                indent: indent,
                tagName: p.tagName
            });
            buf.push(html);
        }

        // close remaining item
        for (var topItem = stack.pop(); topItem; topItem = stack.pop()) {
            buf.push('</' + topItem.tagName + '>')
        }

        return buf.join('');
    };


    mh.html = html;
    mh.strIn = strIn;
}).call(this);
