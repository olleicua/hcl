(var func-list [])
(times (i 4)
       (func-list.push (# () i)))
(console.log (map func-list (# (f) (f))))

(var func-list [])
(for (x [1 2 3 4])
       (func-list.push (# () x)))
(console.log (map func-list (# (f) (f))))
