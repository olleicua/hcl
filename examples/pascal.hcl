;; memoize
(def my-memoize
     (# (func)
        (let (memo {})
          (# (args...)
             (let (json (JSON.stringify args))
               (or (get memo json)
                   (set (get memo json) (func.apply undefined args))))))))

;; choose w/ memoize
(def choose
     (my-memoize (# (m n)
                    (if (or (= 0 n) (= m n)) 1
                      (+ (choose (--1 m) n)
                         (choose (--1 m) (--1 n)))))))

(def max-rows 20)

(times (row max-rows)
     (times (col (+1 row))
      (process.stdout.write (cat (choose row col) " ")))
     (process.stdout.write "\n"))
