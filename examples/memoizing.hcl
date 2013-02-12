;; choose w/o memoize
(def choose
     (# (m n)
        (if (or (= 0 n) (= m n)) 1
          (+ (choose (-1 m) n)
             (choose (-1 m) (-1 n))))))

;; memoize
(def memoize
     (# (func)
        (let (memo {})
          (# (args...)
             (let (json (JSON.stringify args))
               (or (get memo json)
                   (set (get memo json) (func.apply undefined args))))))))

;; choose w/ memoize
(def choose-memo
     (memoize (# (m n)
                 (if (or (= 0 n) (= m n)) 1
                   (+ (choose-memo (-1 m) n)
                      (choose-memo (-1 m) (-1 n)))))))
     
(console.log (choose 5 2))
(console.log (choose 20 10))
(console.log (choose-memo 50 30))
