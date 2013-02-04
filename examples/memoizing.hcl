;; choose w/o memoize
(def choose
     (# (m n)
        (if (or (= 0 n) (= m n)) 1
          (+ (choose (- m 1) n)
             (choose (- m 1) (- n 1))))))

;; memoize
(def memoize
     (# (func) 
        (var memo {})
        (# (args...)
           (var json (JSON.stringify args))
           (or (get memo json)
               (set (get memo json) (func.apply undefined args))))))

;; choose w/ memoize
(def choose-memo
     (memoize (# (m n)
                 (if (or (= 0 n) (= m n)) 1
                   (+ (choose-memo (- m 1) n)
                      (choose-memo (- m 1) (- n 1)))))))
     
(console.log (choose 5 2))
(console.log (choose 20 10))
(console.log (choose-memo 50 30))
