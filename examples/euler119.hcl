(def digit-sum
     (# (n)
        (def result 0)
        (for (digit (string n))
             (set+ result (number digit)))
        result))

(def preliminary-check?
     (# (sum n)
        (cond
         ((= 1 sum) false)
         ((!= 0 (% n (square sum))) false)
         (true true))))

;(def brute-check?
;     (# (sum n)
;        (console.log 2)
;        (def x n)
;        (while (and (= 0 (% x sum)) (> x sum))
;          (set/ x sum))
;        (= x sum)))

(def brute-check?
     (# (sum n)
        (cond
         ((= n sum) true)
         ((= 0 (% n sum)) (brute-check? sum (/ n sum)))
         (true false))))

(def in-sequence?
     (# (n)
        (let (sum (digit-sum n))
          (if (preliminary-check? sum n) (brute-check? sum n) false))))

(def x 0)
(for ((var i 11) (< i 1e4) (++ i))
     (when (in-sequence? i)
       (++ x)
       (console.log x i)))