(def x 1)
(def y 5)

(def foo
	 (# (y)
		(def z 3)
		(console.log x y z)))

(def z 7)

(foo 2)
(console.log x y z)

(def bar
	 (# (x)
		;; when and let are implemented using functions but don't create a new 
		;; scopes for the purpose of var/def
		(let () (var y 2))
		(when (= x "yes")
		  (var y 3))
		(+ y 2)))

(console.log (bar "no") (bar "yes"))

(console.log ((# (a b c)
				 (var x a) (var y b) (var z c)
				 (+ x y z))
			  9 8 7))