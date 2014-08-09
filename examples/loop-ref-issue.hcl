(def size-gen (# () (console.log "gen") 3))
(def list-gen (# () (console.log "gen") [ 1 2 3 ]))

(times (i (size-gen)) (console.log i))
(for (x (list-gen)) (console.log x))
(for ((i x) (list-gen)) (console.log i x))
