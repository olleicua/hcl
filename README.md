Hot Cocoa Lisp
====

Douglas Crockford has called JavaScript "Lisp in C's
clothing"<sup>[1](#references)</sup>. Hot Cocoa Lisp could be
described as an attempt to put it back into Lisp's clothing. The basic
idea is a language with the syntax of Lisp that compiles to
JavaScript, much like CoffeeScript. Like CoffeeScript, you should be
able to use existing JavaScript libraries seamlessly from Hot Cocoa
Lisp and vice-versa. Hot Cocoa Lisp emphasizes functional programming
by providing a natural syntax for highly nested function calls and
providing tools to make common functional idioms more natural while
maintaining all of the good parts of JavaScript.

This implementation runs using [Node.js](http://nodejs.org/) as a
convenient command line interface for JavaScript.  It is often
convenient to also use Node.js to run code compiled from Hot Cocoa
Lisp.  Many of the examples below assume basic familiarity with the
Node.js CLI.

Basic Syntax
----

The syntax of Hot Cocoa Lisp is a combination of that of JavaScript
and that of Lisp.  Functions calls take the form of Lisp style
S-expressions and, like Lisp, every syntax in the language takes the
form of function call.  Additionally, the dotted object access syntax
from JavaScript (e.g. `foo.bar`) is allowed.  So for example:

**Hot Cocoa Lisp**

```lisp
(console.log "Hello World!")
```

**JavaScript**

```javascript
console.log("Hello World!");
```

Getting Started
----

Hot Cocoa Lisp can be installed using [npm](https://npmjs.org/):

    $ npm -g install hot-cocoa-lisp
    
Once installed a file can be compiled and run using `hcl -n`:

    $ cat hello.hcl
    (console.log "Hello World!")
    
    $ hcl -n hello.hcl
    Hello World!

There is also a REPL:

    $ hcl
    hcl> (+ 1 2 3)
    6

More instructions can be found using `hcl --help`

Arrays, Objects, and Variables
----

Array and object literals can be declared exactly as they can in
JavaScript with the exception that the commas and colons are optional.

Elements of arrays and objects can be accessed using `get`. (Or
synonymously `nth`).  `get` is equivalent to the JavaScript syntax
`obj[key]`.

Variables can be initialized with `var` or `def`.  The two are
synonyms but `def` is preferred when the value is expected not to
change and `var` is preferred when it might change.

The values of variables and elements of objects and arrays can be
modified using `set` which is equivalent to the JavaScript `a = b`.
`set` has a special form with 3 arguments which can be used to modify
an element of an object or array and is equivalent to the JavaScript
`a[b] = c`.

**Hot Cocoa Lisp**

```lisp
;; initialize variables
(var foo 7)
(var bar [ 1 2 3 ] )
(var baz)

;; access
(console.log (get bar 0)) ; 1

;; assignments
(set (get bar 3) 4)
(set baz { one 1 two 2 } )
(set baz.three 3)
(set (get baz "four") 4)
(set baz "four" 4) ; alternate special form
```

**JavaScript**

```javascript
var foo = 7, bar = [1, 2, 3], baz;

console.log(bar[0]); // 1

bar[3] = 4;
baz = { one: 1, two: 2 };
baz.three = 3;
baz["four"] = 4;
```

It should be noted that unlike Lisp, words in places besides the
beginning of an S-expression are not symbols that can be manipulated
as values, evaluated, or quoted to prevent evaluation.  Rather they
are simply identifiers and they work exactly as they would in
JavaScript with the exception that they aren't limited to the
characters normally allowed in JavaScript identifiers (see
[Syntax Details](#syntax-details) below).

As with Lisp, the `;` character begins a one line comment.

Functions and Loops
----

### functions
Function literals (a.k.a. lambdas) can be defined using `lambda`,
which can also be spelt `function`, or the much shorter `#`.  Because
in JavaScript (just like Scheme) functions occupy the same namespace
as other variables, a simple function definition can be made using a
combination of `def` and `#`:

**Hot Cocoa Lisp**

```lisp
(def factorial
    (# (n)
        (if (< n 2) 1
            (* n (factorial (- n 1))))))
```

**JavaScript**

```javascript
var factorial = (function(n) { return ((n < 2) ? 1 : factorial(n - 1)) });
```

Three basic loops are provided in Hot Cocoa Lisp: `while`, `times`, and
`for`.

### while
`while` is the familiar while loop from JavaScript:

**Hot Cocoa Lisp**

```lisp
(var input)
(while (!= "exit" (set input (prompt "enter a command")))
    (alert (cat "You entered the command: " input)))
(alert "Goodbye")
```        

**JavaScript**

```javascript
var input;
(function() {while ((("exit" !== (input = prompt("enter a command"))))) { alert(("You entered the command: " + input)); }}).call(this);
alert("Goodbye");
```

It's worth noting that the normal JavaScript looping construct gets
wrapped in a function call here to ensure that while expression can be
nested inside of larger expression for example:

**Hot Cocoa Lisp**
    
```lisp
(var input)
(if (!= "yes" (prompt "do you want to enter a loop?")) (alert "ok")
    (while (!= "exit" (set input (prompt "enter a command")))
        (alert (cat "You entered the command: " input))))
(alert "Goodbye")
```        

**JavaScript**

```javascript
var input;
((!== "yes" prompt("do you want to enter a loop?")) ? alert("ok") : (function() {while ((("exit" !== (input = prompt("enter a command"))))) { alert(("You entered the command: " + input)); }}).call(this));
alert("Goodbye");
```

### times

`times` is a standard loop that counts up from 0 to n:

**Hot Cocoa Lisp**
    
```lisp
(times (x 10)
    (console.log x))
```

**JavaScript**

```javascript
(function() { for (var x = 0; x < 10; x++) { console.log(x); }}).call(this);
```

### for

`for` takes two forms depending on whether its first argument has 2 or
3 elements.  With 2 the `for` acts like a Python-style for loop.  With
3 the `for` acts like a for loop from JavaScript or C.

**Hot Cocoa Lisp**
    
```lisp
(for (x [ 2 4 6 ] )
    (console.log(x)))

(for ((var x 1) (< x 100) (set* x 2))
    (console.log(x)))
```

**JavaScript**

```javascript
(function() { for (var _i_ = 0; _i_ < [2, 4, 6].length; _i_++) { var x = [2, 4, 6][_i_]; console.log(x); }}).call(this);

(function() { for (var x = 1; x < 100; x *= 2) { console.log(x); }}).call(this);
```

The `set*` above is equivalent to the JavaScript `*=` operator.  There
are similar constructs for other arithmetic operators including
`set+`, `set-`, and `set/`.

Splats
----

As with JavaScript, user defined functions can take any number of
arguments.  If more arguments are specified in the API then are passed
in the call, the extra arguments are assigned the value `undefined`.
All arguments are then stored in the `arguments` object.  Unlike
JavaScript, arbitrary arguments can also be captured using splats.  If
the last argument specified in the API ends with three dots then all
remaining arguments passed are stored in an array.

**Hot Cocoa Lisp**
    
```lisp
(def print-numbers
    (# (label numbers...)
        (for (n numbers)
            (console.log (cat label ": " n)))))

(print-numbers "num" 1 2 3)
```

**JavaScript**

```javascript
print_hyphen_numbers = (function(label) {var numbers = [].slice.call(arguments, 1), _i0_, n;  return (function() {for (_i0_ = 0; _i0_ < numbers.length; _i0_++) { var n = numbers[_i0_]; console.log((label + ": " + n)); }}).call(this); });

print_hyphen_numbers("num", 1, 2, 3);
```

**Output**

    num: 1
    num: 2
    num: 3

Annotations
----

One of the downsides of emphasizing a functional style is that making
the compiled JavaScript Source readable is basically a lost cause. For
this reason inline annotations of the original source code are added
to the compiled output to provide context for debugging purposes.

**Hot Cocoa Lisp**

```lisp
;; define a function
(def do-math (# (x) (+ (* 7 x) (- x / 3))))

;; complex functional expression
(times (x 10)
    (if (< x 5)
        (console.log (do-math x))
      (console.log (do-math (do-math x)))))
```

**JavaScript**

```javascript
var do_hyphen_math, x;

// ;; define a function
// (def do-math (# (x) (+ (* 7 x) (/ x 3))))

do_hyphen_math = (function(x) {  return ((7 * x) + (x / 3)); });

// ;; complex functional expression
// (times (x 10)
//     (if (< x 5)
//         (console.log (do-math x))
//       (console.log (do-math (do-math x)))))

(function() {for (x = 0; x < 10; x++) { (((x < 5)) ? console.log(do_hyphen_math(x)) : console.log(do_hyphen_math(do_hyphen_math(x)))); }}).call(this);
```

Underscore
----

The `-u` flag makes Underscore.js 1.4.3 available at the top level.
Each property of the `_` object added as a top level function. For
example:

```lisp
(def _ (require "underscore"))

(console.log (_.map [ 1 2 3 ] (# (x) (+ 2 x))))
```

could be written using the `-u` flag as

```lisp
(console.log (map [ 1 2 3 ] (# (x) (+ 2 x))))
```

This also works in the REPL.

Syntax Details
----

### boolean literals

The literal values `true`, `false`, `null`, `undefined`, and `NaN`
work exactly as they do in JavaScript with the exception that the
built-in functions for determining the types of values will
differentiate `null` and `NaN` into their own types (null and nan
respectively).

```lisp
(type true) ; "boolean"
(type false) ; "boolean"
(type null) ; "null"
(type undefined) ; "undefined"
(type NaN) ; "nan"
```

### number literals

Number literals follow the JSON
specification<sup>[2](#references)</sup> for numbers.  That is to say
anything that matches the regular expression
`-?(0|[1-9][0-9]*)(\.[0-9]+)?([eE][-+]?[0-9]+)?` is parsed as a
number  `Infinity` and `-Infinity` are also interpreted as
numbers.  Additionally, fractions of the form `x/y` where `x` and `y`
are sequences of digits that don't begin with `0` are interpreted as
numbers and wrapped in parentheses to elliminate order of operations
issues.  For example:

**Hot Cocoa Lisp**

```lisp
(+ 1 1/2) ; 1.5
```

**Compiled JavaScript**

```javascript
(1 + (1/2)) // 1.5
```

### string literals

String literals work just as they do in JavaScript.

### identifiers

Identifiers in may contain any combination of letters digits or any of
the following characters:

`_`, `!`, `?`, `$`, `%`, `&`, `@`, `#`, `|`, `~`, `*`, `+`, `-`, `=`, `/`,
`<`, `>`, `^`, or <code>`</code>

Identifiers may not begin with digits or be interpretable as a
number.  For example `-1` will be parsed as a number and not an
identifier.  Identifiers with characters that aren't normally allowed
in JavaScript are represented by replacing all occurrences of symbols
not normally allowed in JavaScript identifiers with underscore
delimited place-holders, for example `a/b` becomes `a_slash_b`.  To
prevent accidental overlap `_` is replaced with `__`.  This creates an
inconvenience in the case that global variables from external
libraries written in JavaScript contain underscores.  It is always
possible to access them via the global object (`global` in Node.js or
`window` in a browser) however because this can be somewhat
unreliable, the `from-js` function is provided:

**External JavaScript Library**

```javascript
some_cool_global_variable = { ... }
```

**Hot Cocoa Lisp**

```lisp
(make-use-of (from-js some_cool_global_variable))
```

**Compiled JavaScript**

```javascript
make_hyphen_use_hyphen_of(some_cool_global_variable);
```

### array and object literals

Array and object literals are translated by the parser into
S-expressions so:

```lisp
{ colors [ "red" "blue" "green" ]
  shapes [ "square" "triangle" ] }
```

is equivalent to 

```lisp
(object colors (array "red" "blue" "green")
        shapes (array "square" "triangle"))
```

either will be compiled to

```javascript
{ colors: ["red", "blue", "green"], shapes: ["square", "triangle"] }
```

### dotted object access

Dotted object access is also translated by the parser to
S-expressions.  This means that

```lisp
(set foo.bar (snap.crackle.pop))
```

is equivalent to 

```lisp
(set (. foo bar) ((. snap crackle pop)))
```

which will be compiled to

```javascript
foo.bar = snap.crackle.pop();
```

**Hot Cocoa Lisp**

```lisp
;; define a function
(def do-math (# (x) (+ (* 7 x) (- x / 3))))

;; complex functional expression
(times (x 10)
    (if (< x 5)
        (console.log (do-math x))
      (console.log (do-math (do-math x)))))
```

**JavaScript**

```javascript
var do_hyphen_math, x;

// ;; define a function
// (def do-math (# (x) (+ (* 7 x) (/ x 3))))

do_hyphen_math = (function(x) {  return ((7 * x) + (x / 3)); });

// ;; complex functional expression
// (times (x 10)
//     (if (< x 5)
//         (console.log (do-math x))
//       (console.log (do-math (do-math x)))))

(function() {for (x = 0; x < 10; x++) { (((x < 5)) ? console.log(do_hyphen_math(x)) : console.log(do_hyphen_math(do_hyphen_math(x)))); }}).call(this);
```

Function reference
----

The following reference describes all of the syntaxes built into Hot
Cocoa Lisp.

Functions marked with _*_ don't necessarily compile all
of their arguments.

Functions marked with _**_ can be accessed by their names within the
language.  For example:

```lisp
;; this should be compiled with the -u flag to include map from underscore
(map [ 1 2 3 ] +1) ; [ 2 3 4 ]
```

* * *

### nop

_**_

     (nop)

Takes 0 arguments and returns `undefined`.

**Hot Cocoa Lisp**

```lisp
(def bogus-function (# () (nop)))
```

**JavaScript**

```javascript
var bogus_hyphen_function = (function() { return undefined; });
```

* * *

### .

_*_

    (. object keys...)

Takes 2 or more arguments and does chained object access.

**Hot Cocoa Lisp**

```lisp
(. object key1 key2)
```

**JavaScript**

```javascript
object.key1.key2;
```

* * *

### get

_**_

Synonyms: `nth`

    (get object key)

Takes 2 arguments and does object or array access.

**Hot Cocoa Lisp**

```lisp
(get object key)
```

**JavaScript**

```javascript
object[key]
```

* * *

### list

Synonyms: `array`

    (list ...)

Takes 0 or more arguments and creates an array literal.

**Hot Cocoa Lisp**

```lisp
(list 1 2 3 4)
```

**JavaScript**

```javascript
[1, 2, 3, 4]
```

* * *

### object

_*_

    (object ...)

Takes an even number of arguments and creates an object literal.  The
first in each pair of arguments is interpreted as a key (and converted
to a string if it is an identifier) and the second in each pair is
compiled and interpreted as a value.

**Hot Cocoa Lisp**

```lisp
(object x 1 y 2 z 3)
```

**JavaScript**

```javascript
{ "x": 1, "y": 2, "z": 3 }
```

* * *

### inherit

_**_

Synonyms: `new`

    (inherit obj)

Takes 1 argument and creates a new object that inherits prototypally
from it.

**Hot Cocoa Lisp**

```lisp
(var foo { a 1 } )
(var bar (inherit foo))
(get bar "a") ; 1
```

**JavaScript**

```javascript
var foo = { a: 1 };
var bar = Object.create(foo);
bar["a"] ; 1
```

* * *

### if

_**_

     (if condition yes no)

Takes 3 arguments. Evaluates and returns the second if the first
evaluates to true. Otherwise evaluates and returns the third.

**Hot Cocoa Lisp**

```lisp
(if (= 1 number) "one" "not one")
```

**JavaScript**

```javascript
((1 === number) ? "one" : "not one")
```

* * *

### begin

    (begin statements...)

Takes 1 or more arguments, evaluates each of them in turn and returns
the last.

**Hot Cocoa Lisp**

```lisp
(if (condition)
    (begin (thing1) (thing2))
  (begin (thing3) (thing4)))
```

**JavaScript**

```javascript
(condition() ? (function() { thing1(); return thing2(); }).call(this) : (function() { thing3(); return thing4(); }).call(this)
```

* * *

### when

     (when condition statements...)

Takes 2 or more arguments.  Check whether the first evaluates to true
then evaluates the rest if the first was true.  Returns the last
statement evaluated.

**Hot Cocoa Lisp**

```lisp
(when (output-requested)
    (console.log things)
    (document.write things))
```

**JavaScript**

```javascript
(output_hyphen_requested() && (function() { console.log(things); return document.write(things); }).call(this))
```

* * *

### cond

_*_

    (cond conditions...)

Takes 1 or more condition/result pairs.  Evaluates and returns the
first result whose condition returns true and `undefined` if none do.

**Hot Cocoa Lisp**

```lisp
(cond
    ((list? x) (x.join " "))
    ((object? x) "[OBJECT]")
    (true x))
```

**JavaScript**

```javascript
((Object.prototype.toString.call(x) === "[object Array]") ? x.join(" ") : (x !== null && typeof(x) === "object") ? "[OBJECT]" : true ? x : undefined)
```

* * *

### while

     (while condition statements...)

Takes 2 or more arguments.  Evaluates the arguments after the first
repeatedly as long as the first evaluates to true.  Returns `undefined`.

**Hot Cocoa Lisp**

```lisp
(var i 10)
(while (-- i)
    (alert i))
```

**JavaScript**

```javascript
var i = 10;
(function() {while (i--) { alert(i); }}).call(this);
```

* * *

### for

_*_

    (for loop_init statements...)

Takes 2 or more arguments.

If the first argument is has two elements:

    (for (iterator array) statements...)

The statements are evaluated once for each element of the array with
the iterator assigned to that element.

If the first argument is has three elements:

    (for (init condition iterator) statements...)

The init is evaluated once at the beginning then until the condition
evaluates to false the statements are evaluated and then the iterator
is evaluated.

Returns `undefined`.

**Hot Cocoa Lisp**

```lisp
(for (x my-list)
    (alert x))

(for ((var x 1) (< x 20) (set* x 2))
    (alert x))
```

**JavaScript**

```javascript
(function() {for (var _i0_ = 0; _i0_ < my_hyphen_list.length; _i0_++) { var x = my_hyphen_list[_i0_]; alert(x); }}).call(this);

(function() {for (var x = 1; ((x < 20)); (x *= 2)) {  alert(x); }}).call(this);
```

* * *

### times

_*_

    (times (iterator number) statements...)

Takes 2 or more arguments.  The statements are evaluated once for each
non-negative integer less than the number with the iterator assigned
to that integer.  Returns `undefined`.

**Hot Cocoa Lisp**

```lisp
(times (_ 10) (process.stdout.write " "))
```

**JavaScript**

```javascript
(function() {for (__ = 0; __ < 10; __++) { process.stdout.write(" "); }}).call(this);
```

* * *

### error

Synonyms: `throw`

    (error message)

Takes 1 argument. Throws a new error with the specified message.

**Hot Cocoa Lisp**

```lisp
(error "This isn't meant to happen")
```

**JavaScript**

```javascript
(function() {throw new Error("This isn't meant to happen");}).call(this);
```

* * *

### attempt

_*_

    (attempt try [catch] [finally])

Takes 2-3 arguments.  Creates a try..catch..finally block.  It can
take any of the following three forms:

**Hot Cocoa Lisp**

```lisp
(attempt
    (try (things))
    (catch e
        (handle-error e)))
```

**JavaScript**

```javascript
try {
    things();
} catch (e) {
    handle_hyphen_error(e);
}
```

**Hot Cocoa Lisp**

```lisp
(attempt
    (try (things))
    (finally    (finish things)))
```

**JavaScript**

```javascript
try {
    things();
} finally {
    finish(things);
}
```

**Hot Cocoa Lisp**

```lisp
(attempt
    (try (things))
    (catch e
        (handle-error e))
    (finally (finish things)))
```

**JavaScript**

```javascript
try {
    things();
} catch (e) {
    handle_hyphen_error(e);
} finally {
    finish(things);
}
```

Returns `undefined`.

* * *

### random-float

_**_

Takes 0 arguments and returns a random number between 0 and 1.

**Hot Cocoa Lisp**

```lisp
(random-float)
```

**JavaScript**

```javascript
Math.random();
```

* * *

### random-integer

_**_

Takes 1 argument and returns a random non negative integer lower than it.

**Hot Cocoa Lisp**

```lisp
(random-integer 7)
```

**JavaScript**

```javascript
parseInt(Math.random() * 7);
```

* * *

### +

_**_

Synonyms: `cat`

    (+ summand1 additional_summands...)

Takes 2 or more arguments and applies the JavaScript `+` operator to
them in order.

**Hot Cocoa Lisp**

```lisp
(+ 1 2 3) ; 6
(cat "foo" "bar" "baz") ; "foobarbaz"
```

**JavaScript**

```javascript
(1 + 2 + 3) // 6
("foo" + "bar" + "baz") // "foobarbaz"
```

* * *

### +1

_**_

     (+1 summand)

Takes 1 argument.  Adds 1 to the summand.

**Hot Cocoa Lisp**

```lisp
(+1 7) ; 8
```

**JavaScript**

```javascript
(7 + 1) // 8
```

* * *

### -

_**_

     (- args...)

Takes 1 or more arguments.

Take one of the following two forms:

    (- number)

The opposite of the number is returned.

    (- minuend subtrahends...)

Subtracts each of the subtrahends from the minuend.

**Hot Cocoa Lisp**

```lisp
(- 7) ; -7
(- 7 2) ; 5
(- 7 2 3) ; 2
```

**JavaScript**

```javascript
(- 7) // -7
(7 - 2) // 5
(7 - 2 - 3) // 2
```

* * *

### --1

_**_

     (--1 minuend)

Takes 1 argument.  Subtracts 1 from the minuend.

**Hot Cocoa Lisp**

```lisp
(--1 8) ; 7
```

**JavaScript**

```javascript
(8 - 1) // 7
```

* * *

### *

_**_

     (* factor1 additional_factors...)

Takes 2 or more arguments and multiplies them together.

**Hot Cocoa Lisp**

```lisp
(* 2 3 4) ; 24
```

**JavaScript**

```javascript
(2 * 3 * 4) // 24
```

* * *

### *2

_**_

Synonyms: `double`

    (*2 factor)

Takes 1 argument.  Multiplies the factor by 2.

**Hot Cocoa Lisp**

```lisp
(*2 5) ; 10
```

**JavaScript**

```javascript
(5 * 2) // 10
```

* * *

### /

_**_

     (/ dividend divisors...)

Takes 2 or more arguments.  Divides the dividend by each of the divisors.

**Hot Cocoa Lisp**

```lisp
(/ 10 2) ; 5
(/ 100 2 5) ; 10
```

**JavaScript**

```javascript
(10 / 2) // 5
(100 / 2 / 5) // 10
```

* * *

### /2

_**_

Synonyms: `half`

    (/2 dividend)

Takes 1 argument.  Divides the dividend by 2.

**Hot Cocoa Lisp**

```lisp
(/2 8) ; 4
```

**JavaScript**

```javascript
(8 / 2) // 4
```

* * *

### ^

_**_

     (^ base exponent)

Takes 2 arguments.  Returns the base to the power of the exponent.

**Hot Cocoa Lisp**

```lisp
(^ 2 5) ; 32
```

**JavaScript**

```javascript
Math.pow(2, 5) // 32
```

* * *

### ^2

_**_

Synonyms: `square`

    (^2 base)

Takes 1 argument.  Squares the base.

**Hot Cocoa Lisp**

```lisp
(^2 9) ; 81
```

**JavaScript**

```javascript
(9 * 9) // 81
```

* * *

### sqrt

_**_

     (sqrt number)

Takes 1 argument.  Returns the square root of the number.

**Hot Cocoa Lisp**

```lisp
(sqrt 100) ; 10
```

**JavaScript**

```javascript
Math.sqrt(100) // 10
```

* * *

### %

_**_

Synonyms: `mod`

    (% number moduli...)

Takes 2 or more arguments.  For each of the moduli the number is
replaced by the remainder of number / modulus.

**Hot Cocoa Lisp**

```lisp
(% 26 10) ; 6
(% 1010 100 7) ; 3
```

**JavaScript**

```javascript
(26 % 10) // 6
(1010 % 100 % 7) // 3
```

* * *

### <

_**_

Synonyms: `lt?`

    (< number additional_numbers...)

Takes 2 or more arguments.  Returns true if the each number is larger
than the previous.

**Hot Cocoa Lisp**

```lisp
(< 2 3)
(< 10 15 20 25)
```

**JavaScript**

```javascript
(2 < 3)
((10 < 15) && (15 < 20) && (20 < 25))
```

* * *

### >

_**_

Synonyms: `gt?`

    (> number additional_numbers...)

Takes 2 or more arguments.  Returns true if the each number is smaller
than the previous.

**Hot Cocoa Lisp**

```lisp
(> 3 2)
(> 25 20 15 10)
```

**JavaScript**

```javascript
(3 > 2)
((25 > 20) && (20 > 15) && (15 > 10))
```

* * *

### <=

_**_

Synonyms: `lte?`

    (<= number additional_numbers...)

Takes 2 or more arguments.  Returns true if the each number is smaller
than or equal to the previous.

**Hot Cocoa Lisp**

```lisp
(<= 2 3)
(<= 15 15 20 25)
```

**JavaScript**

```javascript
(2 <= 3)
((15 <= 15) && (15 <= 20) && (20 <= 25))
```

* * *

### >=

_**_

Synonyms: `gte?`

    (>= number additional_numbers...)

Takes 2 or more arguments.  Returns true if the each number is larger
than or equal to the previous.

**Hot Cocoa Lisp**

```lisp
(>= 3 2)
(>= 20 20 15 10)
```

**JavaScript**

```javascript
(3 >= 2)
((20 >= 20) && (20 >= 15) && (15 >= 10))
```

* * *

### =

_**_

Synonyms: `is`, `is?`, `eq`, `eq?`, `equal`, `equal?`, `equals`, `equals?`

    (= arg1 args...)

Takes 2 or more arguments.  Returns true if all of the arguments are
equal.

**Hot Cocoa Lisp**

```lisp
(= 2 2)
(= 20 20 20)
```

**JavaScript**

```javascript
(2 === 2)
((20 === 20) && (20 === 20))
```

* * *

### !=

_**_

Synonyms: `isnt`, `isnt?`, `neq`, `neq?`

    (!= arg1 args...)

Takes 2 or more arguments.  Returns true if none of the adjacent
arguments are equal.

**Hot Cocoa Lisp**

```lisp
(= 2 3)
(= 20 21 22)
```

**JavaScript**

```javascript
(2 !== 3)
((20 !== 21) && (21 !== 22))
```

* * *

### =0

_**_

Synonyms: `zero?`

    (=0 number)

Takes 1 argument.  Returns true if the number is 0.

**Hot Cocoa Lisp**

```lisp
(=0 0)
```

**JavaScript**

```javascript
(0 === 0)
```

`>0` (or `positive?`), `<0` (or `negative?`), `>=0` (or `non-negative?`),
and `<=0` (or `non-positive?`) work similarly.

* * *

### &

_**_

Synonyms: `bit-and`

    (& number1 number2)

Takes 2 arguments and performs a bitwise and between them.

**Hot Cocoa Lisp**

```lisp
(& 6 3) ; 7
```

**JavaScript**

```javascript
(6 & 3) // 7
```

* * *

### |

Synonyms: `bit-or`

_**_

    (| number1 number2)

Takes 2 arguments and performs a bitwise or between them.

**Hot Cocoa Lisp**

```lisp
(| 6 3) ; 2
```

**JavaScript**

```javascript
(6 | 3) // 2
```

* * *

### <<

_**_

Synonyms: `bit-shift-left`

    (<< number bits)

Takes 2 arguments.  Bit-shifts the number to the left by the specified
number of bits.

**Hot Cocoa Lisp**

```lisp
(<< 1 2) ; 4
```

**JavaScript**

```javascript
(1 << 2) // 4
```

* * *

### >>

_**_

Synonyms: `bit-shift-right`

    (>> number bits)

Takes 2 arguments.  Bit-shifts the number to the left by the specified
number of bits.

**Hot Cocoa Lisp**

```lisp
(>> 4 2) ; 1
```

**JavaScript**

```javascript
(4 >> 2) // 1
```

* * *

### not

_**_

Synonyms: `not?`, `!`

    (not arg)

Takes 1 argument and returns the boolean opposite of it.

**Hot Cocoa Lisp**

```lisp
(not true) ; false
```

**JavaScript**

```javascript
(! true) ; false
```

* * *

### and

_**_

Synonyms: `and?`, `&&`

    (and arg1 arg2...)

Takes 2 or more arguments and returns true if all of them evaluate to
true.

**Hot Cocoa Lisp**

```lisp
(and true true true)
```

**JavaScript**

```javascript
(true && true && true)
```

* * *

### or

_**_

Synonyms: `or?`, `||`

    (or arg1 arg2...)

Takes 2 or more arguments and returns true if any of them evaluate to
true.

**Hot Cocoa Lisp**

```lisp
(or false false true)
```

**JavaScript**

```javascript
(false || false || true)
```

* * *

### xor

_**_

     (xor arg1 arg2)

Takes 2 arguments returns true if exactly one of them evaluates to
true.

**Hot Cocoa Lisp**

```lisp
(xor true false)
```

**JavaScript**

```javascript
((true || false) && (! (true && false)))
```

* * *

### def

Synonyms: `var`

    (def name [value])

Takes 1-2 arguments.  Initialize a new variable in the current scope
with the specified name.  Assign the value to it if one is specified.

**Hot Cocoa Lisp**

```lisp
(def foo 1)
```

**JavaScript**

```javascript
var foo = 1;
```

* * *

### set

     (set variable [key] value)

Takes 2-3 arguments.

If 2 arguments are given:

    (set l_value r_value)

Assigns the r\_value to the l\_value and returns the r_value.

If 3 arguments are given:

    (set object key value)

Assigns the specified value to the specified key in the object and
returns the value.

**Hot Cocoa Lisp**

```lisp
(set foo 10)
(set bar baz 12)
```

**JavaScript**

```javascript
(foo = 10)
(bar[baz] = 12)
```

* * *

### set+

     (set+ variable [key] summand)

Takes 2-3 arguments.

If 2 arguments are given:

    (set l_value summand)

Adds the summand to the l_value and returns the new value.

If 3 arguments are given:

    (set object key summand)

Adds the summand to the value associated with the specified key in the
object and returns the new value.

**Hot Cocoa Lisp**

```lisp
(set+ foo 10)
(set+ bar baz 12)
```

**JavaScript**

```javascript
(foo += 10)
(bar[baz] += 12)
```

`set-`, `set*`, `set/`, `set%`, `set<<`, `set>>`, `set|`,  and `set&` all
work the same as `set+` except with subtraction, multiplication,
division, modular arithmetic, bit-shifting (left and right), bitwise
or, and bitwise and respectively.

* * *

### ++

Synonyms: `inc`

    (++ number)

Takes 1 argument and increments it.

**Hot Cocoa Lisp**

```lisp
(++ number)
```

**JavaScript**

```javascript
number++
```

* * *

### --

Synonyms: `dec`

    (-- number)

Takes 1 argument and decrements it.

**Hot Cocoa Lisp**

```lisp
(-- number)
```

**JavaScript**

```javascript
number--
```

* * *

### let

_*_

    (let (assignments...) statements...)

Takes 2 or more arguments.  There must be an even number of
assignments.  The second of each pair of assignments is evaluated and
assigned to the first in a new scope.  Then the statements are
evaluated in that scope.  The result of the last statement is returned.

**Hot Cocoa Lisp**

```lisp
(let (a 1 b 2)
    (+ a b))
```

**JavaScript**

```javascript
(function(a, b) { return (a + b); }).call(this, 1, 2)
```

* * *

### #

_*_ Synonyms: `lambda`, `function`

    (# (args...) statements...)

Takes 2 or more arguments.  Creates a new function literal with the
specified arguments and statements.

If the final argument specified has three dots after it then it is a
splat and all of the remaining arguments passed are assigned to it in
an array.

**Hot Cocoa Lisp**

```lisp
(# (a b) (* a b))

(# (args...) (map args +1))
```

**JavaScript**

```javascript
(function(a, b) {  return (a * b); })

(function() {var args = [].slice.call(arguments, 0);  return map(args, function(x){return x+1;}); })
```

* * *

### nil?

_**_

     (nil? arg)

Takes 1 argument and returns true if it is `null` or `undefined`.

**Hot Cocoa Lisp**

```lisp
(nil? foo)
```

**JavaScript**

```javascript
(foo === null || foo === undefined)
```

* * *

### boolean?

_**_

     (boolean? arg)

Takes 1 argument and returns true if it is `true` or `false`.

**Hot Cocoa Lisp**

```lisp
(boolean? foo)
```

**JavaScript**

```javascript
(typeof(foo) === "boolean")
```

* * *

### number?

_**_

     (number? arg)

Takes 1 argument and returns true if it is a number.

**Hot Cocoa Lisp**

```lisp
(number? foo)
```

**JavaScript**

```javascript
(typeof(foo) === "number" && (! isNaN(foo)))
```

* * *

### string?

_**_

     (string? arg)

Takes 1 argument and returns true if it is a string.

**Hot Cocoa Lisp**

```lisp
(string? foo)
```

**JavaScript**

```javascript
(typeof(foo) === "string")
```

* * *

### list?

_**_

Synonyms: `array?`

    (list? arg)

Takes 1 argument and returns true if it is an array.

**Hot Cocoa Lisp**

```lisp
(list? foo)
```

**JavaScript**

```javascript
(Object.prototype.toString.call(foo) === "[object Array]")
```

* * *

### object?

_**_

     (object? arg)

Takes 1 argument and returns true if it is an object.

**Hot Cocoa Lisp**

```lisp
(object? foo)
```

**JavaScript**

```javascript
(Object.prototype.toString.call(foo) === "[object Object]")
```

* * *

### re?

_**_

Synonyms: `regex?`, `regexp?`

    (re? arg)

Takes 1 argument and returns true if it is a regular expression.

**Hot Cocoa Lisp**

```lisp
(re? foo)
```

**JavaScript**

```javascript
(Object.prototype.toString.call(foo) === "[object Regexp]")
```

* * *

### function?

_**_

Synonyms: `lambda?`, `#?`

    (function? arg)

Takes 1 argument and returns true if it is a function.

**Hot Cocoa Lisp**

```lisp
(function? foo)
```

**JavaScript**

```javascript
(typeof(foo) === "function")
```

* * *

### empty?

_**_

     (empty? arg)

Takes 1 argument and returns true if it is `null` or has a length of 0.

**Hot Cocoa Lisp**

```lisp
(empty? foo)
```

**JavaScript**

```javascript
(foo === null || (foo).length === 0)
```

* * *

### integer?

_**_

     (integer? arg)

Takes 1 argument and returns true if it is an integer.

**Hot Cocoa Lisp**

```lisp
(integer? foo)
```

**JavaScript**

```javascript
(typeof(foo) === "number" && foo % 1 === 0)
```

* * *

### even?

_**_

     (even? arg)

Takes 1 argument and returns true if it is divisible by 2.

**Hot Cocoa Lisp**

```lisp
(even? foo)
```

**JavaScript**

```javascript
(foo % 2 === 0)
```

* * *

### odd?

_**_

     (odd? arg)

Takes 1 argument and returns true if it is an integer and not
divisible by 2.

**Hot Cocoa Lisp**

```lisp
(odd? foo)
```

**JavaScript**

```javascript
(foo % 2 === 1)
```

* * *

### contains?

_**_

     (contains? array value)

Takes 2 arguments.  Returns true if the array contains the value.

**Hot Cocoa Lisp**

```lisp
(contains? [ 1 2 3 ] 2)
```

**JavaScript**

```javascript
([1, 2, 3].indexOf(2) !== -1)
```

* * *

### type

_**_

Synonyms: `typeof`

    (type arg)

Takes 1 argument and returns a string specifying its type.  The types
are null, undefined, nan, boolean, number, string, array, object, regex,
and function.

**Hot Cocoa Lisp**

```lisp
(type foo)
```

**JavaScript**

```javascript
(function(_value_, _signature_) { return ((_signature_ === "[object Array]") ? "array" : (_signature_ === "[object RegExp]") ? "regex" : (_value_ === null) ? "null" : (_value_ !== _value_) ? "nan" : typeof(_value_)); }).call(this, foo, Object.prototype.toString.call(foo))
```

* * *

### string

_**_

     (string arg)

Takes 1 argument and converts it to a string.

**Hot Cocoa Lisp**

```lisp
(string 10) ; "10"
```

**JavaScript**

```javascript
(10).toString() // "10"
```

* * *

### number

_**_

     (number arg)

Takes 1 argument and converts it to a number.

**Hot Cocoa Lisp**

```lisp
(number "10") ; 10
```

**JavaScript**

```javascript
parseFloat("10") // 10
```

* * *

### integer

_**_

     (integer arg1)

Takes 1 argument and converts it to an integer.

**Hot Cocoa Lisp**

```lisp
(integer "10.1") ; 10
```

**JavaScript**

```javascript
Math.floor(parseFloat("10.1"))
```

* * *

### re

Synonyms: `regex`, `regexp`

    (re expression [options])

Takes 1-2 arguments.  Creates a regular expression literal from the
specified string and options.  Only one backslash is needed to escape
special characters in the expression.

**Hot Cocoa Lisp**

```lisp
(re "foo" "m")
(re "foo\b")
```

**JavaScript**

```javascript
(new RegExp("foo", "m"))
(new RegExp("foo\\b"))
```

* * *

### replace

_**_

     (replace subject search replace)

Takes 3 strings.  Returns a copy of the first with all instances of
the second replaced with the third.

**Hot Cocoa Lisp**

```lisp
(replace "1.800.555.5555" "." "-") ; "1-800.555.5555"
(replace "1.800.555.5555" (re "\." "g") "-") ; "1-800-555-5555"
```

**JavaScript**

```javascript
"1.800.555.5555".replace(".", "-") // "1-800.555.5555"
"1.800.555.5555".replace((new RegExp(".", "g")), "-") // "1-800-555-5555"
```

* * *

### format

_**_

     (format format-string replacements)

Takes a string and either a list or an object.  Replaces each instance
of `~~` in the format string with the value in the replacements list
corresponding to the index of that `~~` (for example the 0th `~~` will
be replaced by the 0th element of the replacements list).  Replaces
each instance `~foo~` in the format string with the value in the
replacements object associated with the key `"foo"` (where foo could
be any string that contains no tildes.

**Hot Cocoa Lisp**

```lisp
(format "(~~) (~~) (~~)" [ 1 7 19 ] ) ; "(1) (7) (19)"
(format " *~stars~* _~underbars~_ " { stars "foo"
                                      underbars "bar" } ) ; " *foo* _bar_ "
```

**JavaScript**

```javascript
var format = function(f,v){var i=0;return f.replace(/~([a-zA-Z0-9_]*)~/g,function(_,k){if(k===''){k=i;i++;}if(v[k]===undefined){return'';}return v[k];})};
format("(~~) (~~) (~~)", [1, 7, 19]); // "(1) (7) (19)"
format(" *~stars~* _~underbars~_ ", { "stars": "foo", "underbars": "bar" }); // " *foo* _bar_ "
```

* * *

### size

_**_

Synonyms: `length`, `count`

    (size arg)

Takes 1 argument and returns its size.

**Hot Cocoa Lisp**

```lisp
(size [ 1 2 3 ] ) ; 3
```

**JavaScript**

```javascript
[1, 2, 3].length // 3
```

* * *

### compile

     (compile file)

Takes a path to a file and runs the hcl compiler on that file.
Returns the path to the compiled JavaScript file.  This is useful for
dependency management.  It is worth noting that the Node.js module
system allows for cyclic dependencies.  The behavior of `require` in
the cyclic case is document at
(http://nodejs.org/api/modules.html#modules_cycles)[http://nodejs.org/api/modules.html#modules_cycles].
`compile` makes sure to only recompile a given file at most once per
compilation to allow for these cyclic dependencies.

**Hot Cocoa Lisp**

```lisp
(require (compile "foo.hcl"))
```

**JavaScript**

```javascript
require("foo.js") // guaranteed up to date
```

* * *

### from-js

_*_

    (from-js identifier)

Takes an identifier and inserts it into the compiled source verbatim.
Throws an error if the identifier isn't a valid Javascript identifier.

**Hot Cocoa Lisp**

```lisp
(from-js foo_bar)
```

**JavaScript**

```javascript
foo_bar
```

* * *

### require

Synonyms: `load`

    (require path)

Calls the require method.  This exists only to support the `load`
synonym and to fix a problem with load paths in the repl.

**Hot Cocoa Lisp**

```lisp
(load "./foo")
```

**JavaScript**

```javascript
require("./foo")
```

* * *
* * *
#### References
1. [http://www.crockford.com/javascript/javascript.html](http://www.crockford.com/javascript/javascript.html)
2. [http://json.org/](http://json.org/)
