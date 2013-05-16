(cond (true (for (n [ 1 2 ]) (console.log n))))

(console.log (begin (set x 2) (cond (true (for (n [ 1 2 ]) (set+ x n)))) x))