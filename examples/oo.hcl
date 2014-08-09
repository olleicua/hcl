(def obj { res "foo"
           self (# () @)
           cat-res (# (x) (cat @res "-" x))
           res-map (# (args...) (map args (@# () @res)))
           cat-res-map (# (args...)
                          (map args (@# (x) (@cat-res x)))) })

(console.log ((obj.self).res-map 1 2 3))
(console.log (obj.cat-res-map 1 2 3))
