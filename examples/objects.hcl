(def format (require "hot-cocoa").format)

;; basic object

(def my_object
     { number 10
       add (# (x) (set this.number (+ x this.number))) } )

(console.log my_object.number) ; 10
(my_object.add 5)
(console.log my_object.number) ; 15
((. my_object add) 7)
(console.log my_object.number) ; 22

(def my_object2 { foo { bar 7 baz 9 } } )
(console.log my_object2.foo.bar) ; 7
(console.log (. my_object2 foo baz)) ; 9

;; inheritance

(def _Person
     { first_name "N/A"
       last_name "N/A"
       full_name (# () (format "~~ ~~" [ this.first_name this.last_name ] ))
       shake_hands (# (other) (console.log (format "~~ shakes hands with ~~"
                                                   [ (this.full_name)
                                                     (other.full_name) ] ))) } )

(def sam (inherit _Person))
(set sam.first_name "Sam")
(set sam "last_name" "Auciello")

(console.log (get sam "first_name")) ; Sam
(console.log sam.first_name) ; Sam

(def jim (inherit _Person))
(set jim.first_name "Jim")
(set jim.last_name "Mahoney")

(jim.shake_hands sam) ; Jim Mahoney shakes hands with Sam Auciello
(jim.shake_hands.call sam jim) ; Sam Auciello shakes hands with Jim Mahoney
