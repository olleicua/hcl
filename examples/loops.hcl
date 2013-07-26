(var y 0)
(times (x 7) (when (even? x) (++ y)))
(console.log y)
(var y 0)
(times (x 7) (unless (even? x) (++ y) (++ y)))
(console.log y)

;; traditional for loop
(def print-all
     (# (args...)
        (for ((set i 0) (< i args.length) (++ i))
             (console.log i (get args i)))))

(print-all "a" "b" "c" "d")

;; python style for loop
(def print-all
     (# (args...)
        (for (x args) (console.log x))))

(print-all "d" "e" "f")

;; while loop
(def linked-list { n { v 1 n { v 2 n { v 3 n { v 5 n { v 8 } } } } } } )

(while (set linked-list (get linked-list "n"))
  (console.log (get linked-list "v") linked-list))

;; nested loops
(for (x [ 2 4 6 ] )
     (for (y [ 3 6 9 ] )
          (console.log (* x y))))