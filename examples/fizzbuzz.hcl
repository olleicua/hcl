(def _ (require "underscore"))

(def divisible (# (n m) (= 0 (mod n m))))

(def evaluated-if
     (# (condition yes no)
        (if (condition yes no) yes no)))

(def fizzbuzz
     (# (n)
        (console.log
         (evaluated-if (# (number words) (empty? words)) n
                       (_.reduce (_.map [[3 "Fizz"] [5 "Buzz"]]
                                        (# (pair)
                                           (if (divisible n (get pair 0))
                                               (get pair 1) "")))
                                 (# (a b) (cat a b)) "")))
        (and (< n 100) (fizzbuzz (+1 n)))))

(fizzbuzz 1)
