(var obj { a null b undefined c 7 })

(for (key ["a" "b" "c"])
     (set|| (get obj key) 9))

(console.log obj)

(set obj { a null b undefined c 7 })

(for (key ["a" "b" "c"])
     (set&& (get obj key) 9))

(console.log obj)
