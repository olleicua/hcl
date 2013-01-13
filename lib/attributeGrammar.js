module.exports = require('hot-cocoa').analyzer({
    '_program': function(tree) {
        return this.analyze(tree[1], this.analyze(tree[0]));
    },
    '_program-tail': function(tree, beginning) {
        if (tree[0] && tree[0].type === '_program') {
            var result = this.analyze(tree[0]);
        } else {
            var result = [];
        }
        result.unshift(beginning);
        return result;
    },
    '_expression': function(tree) {
        return this.analyze(tree[0]);
    },
    '_puncuated-list': function(tree) {
        var result = types.list([]);
        switch (tree[0].type) {
        case '\'' :
            result.push(types.word('quote'));
            break;
        case '`' :
            result.push(types.word('quaziquote'));
            break;
        case '~' :
            result.push(types.word('unquote'));
            break;
        }
        result.push(this.analyze(tree[1]));
        return result;
    },
    '_list': function(tree) {
        return this.analyze(tree[1]);
    },
    '_list-tail': function(tree, beginning) {
        if (tree[0].type === '_expression') {
            var result = this.analyze(tree[1], this.analyze(tree[0]));
        } else {
            var result = types.list([]);
        }
        if (beginning) {
            result.unshift(beginning);
        }
        return result;
    },
    '_literal-list': function(tree) {
        var result = types.list([]);
        result.push(types.word('list'));
        var body = this.analyze(tree[1]);
        for (var i = 0; i < body.length; i++) {
            result.push(body[i]);
            // FIXME: the list wrappers are unneccessary and thus
            // so are the '.values's here
            // ???
        }
        return result;
    },
    '_literal-list-tail': function(tree, beginning) {
        return this['_list-tail'](tree, beginning);
    },
    '_object': function(tree) {
        var result = types.list([]);
        result.push(types.word('object'));
        var body = this.analyze(tree[1]);
        for (var i = 0; i < body.length; i++) {
            result.push(body[i]);
            // FIXME: the list wrappers are unneccessary and thus
            // so are the '.values's here
            // ???
        }
        return result;
    },
    '_object-tail': function(tree, args) {
        if (args) {
            var key = args[0];
            var value = args[1];
        }
        if (tree[0].type === '_atom') {
            var x = this.analyze(tree[1]);
            var result = this.analyze(tree[2], [this.analyze(tree[0]),
                                                this.analyze(tree[1])]);
        } else {
            var result = types.list([]);
        }
        if (key && value) {
            result.unshift(value);
            result.unshift(key);
        }
        return result;
    },
    '_dotted-chain': function(tree) {
        var result = types.list([]);
        result.push(types.word('.'));
        result.push(this.analyze(tree[0].tree[0]));
        result.push(this.analyze(tree[2]));
        var body = this.analyze(tree[3]);
        for (var i = 0; i < body.length; i++) {
            result.push(body[i]);
        }
        return result;
    },
    '_dotted-chain-tail': function(tree) {
        if (tree.length === 0) {
            return [];
        }
        var result = this.analyze(tree[2]);
        result.unshift(this.analyze(tree[1]));
        return result;
    },
    '_atom': function(tree) {
        switch (tree[0].type) { // perhaps without a switch??
        case '.' :
            return types.word('.');
            break;
        case 'word' :
            // TODO: add in regexp check
            // this may need to be a separate macro..
            return types.word(tree[0].text);
            break;
        case 'string' :
            return types.string(tree[0].text);
            break;
        case 'number' :
            return types.number(tree[0].text);
            break;
        case 'boolean' :
            return types.boolean(tree[0].text);
            break;
        }
    },
    'word': function(word) {
        return this['_atom']([word]);
    }
});
