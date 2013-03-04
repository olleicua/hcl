;; create a cyclic dependency without entering an infinite loop
(compile "./dependencies.hcl")

(set module.exports (# (x) (+1 (*2 x))))
