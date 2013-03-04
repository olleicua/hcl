;; call dependency1 as a function on dependency2
(console.log
 ((require (compile "./dependency1.hcl"))
  (require (compile "./dependency2.hcl"))))