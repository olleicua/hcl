(def my-max (# (numbers...)
               (Math.max.apply this numbers)))

(console.log (my-max 1 2 3 4)) ; 4

(def foo (# (x numbers...)
            (console.log x)
            (Math.max.apply this numbers)))

(console.log (foo 7 5 3 4)) ; 7 \n 5
