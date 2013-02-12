(def reverse-list (# (l)
  (if (nil? l.next) l
    (let (next l.next
          result (reverse-list l.next))
      (set l.next.next l)
      (set l.next null)
      result))))

(def list { v 1 next { v 2 next { v 3 } } })

(console.log (JSON.stringify list))
(console.log (JSON.stringify (reverse-list list)))