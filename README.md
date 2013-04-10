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

Basic Syntax
----

The syntax of Hot Cocoa Lisp is a combination of that of JavaScript
and that of Lisp.  Functions calls take the form of Lisp style
S-expressions and, like Lisp, every sytax in the language can take the
form of function call.  Additionally, the dotted object access syntax
from JavaScript (e.g. `foo.bar`) is allowed.  So for example:

**Hot Cocoa Lisp**

    (console.log "Hello World!")

**JavaScipt**

    console.log("Hello World!");

Variables, Arrays, and Objects
----

Variables can be initialized with `var` or `def`.  The two are
synonyms but `def` is preferred when the value is expected not to
change and `var` is preferred when it might change.

Array and object literals can be declared exactly as they can in
Javascript with the exception that the commas and colons are optional.

The values of variables and elements of objects and arrays can be
modified using `set`.  With two arguments `set` does variable
assignement and with three arguments it modifies an element of an
object or array.

**Hot Cocoa Lisp**

    ;; initialize variables
    (var foo 7)
    (var bar [ 1 2 3 ] )
    (var baz)

    ;; assignments
    (set bar 3 4)
    (set baz { one 1 two 2 } )
    (set baz.three 3)
    (set baz "four" 4)

**JavaScipt**

    var foo = 7, bar = [1, 2, 3], baz;
    
    bar[3] = 4;
    baz = { one: 1, two: 2 };
    baz.three = 3;
    baz["four"] = 4;

It should be noted that unike Lisp, words in places besides the
beginning of an S-expression are not symbols that can be manipulated
as values, evaluated, or quoted to prevent evaluation.  Rather they
are simply identifiers and they work exactly as they would in
JavaScript with the exception that they aren't limited to the
characters normally allowed in JavaScript identifiers (see
[identifiers](#identifiers) below)

As with Lisp, the `;` character begins a one line comment.

Functions and Loops
----

Function literals (a.k.a. lambdas) can be defined using `lambda`,
which can also be spelt `function`, or the much shorter `#`.  Because
in JavaScript (just like Scheme) functions occupy the same namespace
as other variables, a simple function definition can be made using a
combination of `def` and `#`:

**Hot Cocoa Lisp**

    (def factorial
		(# (n)
			(if (< n 2) 1
				(* n (factorial (- n 1))))))

**JavaScipt**

    var factorial = (function(n) { return ((n < 2) ? 1 : factorial(n - 1)) });

Three loops are provided in Hot Cocoa Lisp: `while`, `times`, and
`for`.  `while` is the familiar while loop from JavaScript:

**Hot Cocoa Lisp**
	
	(var input)
    (while (!= "exit" (set input (prompt "enter a command")))
		(alert (cat "You entered the command: " input)))
	(alert "Goodbye")
		

**JavaScipt**

    var input;
	(function() {while ((("exit" !== (input = prompt("enter a command"))))) { alert(("You entered the command: " + input)); }}).call(this);
	alert("Goodbye");

It's worth noting that the normal JavaScript looping construct gets
wrapped in a function call here to ensure that while expression can be
nested inside of larger expression for example:

**Hot Cocoa Lisp**
	
	(var input)
	(if (!= "yes" (prompt "do you want to enter a loop?")) (alert "ok")
		(while (!= "exit" (set input (prompt "enter a command")))
			(alert (cat "You entered the command: " input))))
	(alert "Goodbye")
		

**JavaScipt**

    var input;
	((!== "yes" prompt("do you want to enter a loop?")) ? alert("ok") : (function() {while ((("exit" !== (input = prompt("enter a command"))))) { alert(("You entered the command: " + input)); }}).call(this));
	alert("Goodbye");

`times` is a standard loop that counts up from 0 to n:

**Hot Cocoa Lisp**
	
	(times (x 10)
		(console.log x))

**JavaScipt**

	(function() { for (var x = 0; x < 10; x++) { console.log(x); }}).call(this);

`for` takes two forms depending on whether its first argument has 2 or
3 elements.  With 2 the `for` acts like a Python-style for loop.  With
3 the `for` acts like a for loop from JavaScript or C.

**Hot Cocoa Lisp**
	
	(for (x [ 2 4 6 ] )
		(console.log(x)))
	
	(for ((var x 1) (< x 100) (set* x 2))
		(console.log(x)))

**JavaScipt**

	(function() { for (var _i_ = 0; _i_ < [2, 4, 6].length; _i_++) { var x = [2, 4, 6][_i_]; console.log(x); }}).call(this);
	
	(function() { for (var x = 1; x < 100; x *= 2) { console.log(x); }}).call(this);

The `set*` above is equivalent to the JavaScript `*=` operater.  There
are similar constructs for other arithmetic operators including
`set+`, `set-`, and `set/`.

Annotations
----

One of the downsides of emphasizing a functional style is that making
the compiled JavaScript Source readable is basically a lost cause. For
this reason inline annotations of the original source code are added
to the compiled output to provide context for debugging purposes.

**Hot Cocoa Lisp**

    ;; define a function
    (def do-math (# (x) (+ (* 7 x) (- x / 3))))

    ;; complex functional expression
    (times (x 10)
        (if (< x 5)
            (console.log (do-math x))
          (console.log (do-math (do-math x)))))

**JavaScipt**

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

<span id="identifiers"></span>

Identifiers
----

...

Underscore
----

...

The read-evaluate-print loop
----

...

Function reference
----

...

<span id="references"></span>
* * *
1: [http://www.crockford.com/javascript/javascript.html](http://www.crockford.com/javascript/javascript.html)
