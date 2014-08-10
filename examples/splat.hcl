(def my-max (# (numbers...)
               (Math.max.apply this numbers)))

(console.log (my-max 1 2 3 4)) ; 4

(def foo (# (x numbers...)
            (console.log x)
            (Math.max.apply this numbers)))

(console.log (foo 7 5 3 4)) ; 7 \n 5

(def my-and and)
(def sum (# (numbers...) (reduce numbers + 0)))

(def my-list [1 2 3])

(console.log (sum 1 2))
(console.log (sum my-list...))
(console.log (sum 1 my-list...))
(console.log (sum my-list... 2))
(console.log (sum 1 my-list... 2))
(console.log (sum my-list... my-list...))
(console.log (sum 5 my-list... 5 my-list... 5))
(console.log (my-and my-list...))

(def obj { a 1 b (# (args...) (+ @a (sum args))) })
(console.log (obj.b my-list...))
(set obj a 2)
(console.log ((get obj (get { "[[[" "b" } "[[[")) my-list...))
