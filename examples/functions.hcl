(def _ (require "underscore"))

(console.log (map [ 1 2 3 ] +1)
             (map [ 1 2 3 ] --1)
             (map [ 1 2 3 ] *2)
             (map [ 1 2 3 ] /2)
             (map [ 1 2 3 ] ^2))

(console.log (format "(~~) (~~) (~~)" [ 1 2 3 ] ))
(console.log (format "(~foo~) (~bar~)" { bar 7 foo 8 } ))