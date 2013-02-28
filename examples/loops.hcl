; traditional for loop
(def print-all
     (# (args...)
        (for ((set i 0) (< i args.length) (++ i))
             (console.log i (get args i)))))

(print-all "a" "b" "c" "d")

; python style for loop
(def print-all
     (# (args...)
        (for (x args) (console.log x))))

(print-all "d" "e" "f")

; while loop
(def linked-list { n { v 1 n { v 2 n { v 3 n { v 5 n { v 8 } } } } } })

(while (set linked-list (get linked-list "n"))
  (console.log (get linked-list "v") linked-list))