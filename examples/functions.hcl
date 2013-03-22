(def _ (require "underscore"))

(console.log (_.map [ 1 2 3 ] +1)
             (_.map [ 1 2 3 ] --1)
             (_.map [ 1 2 3 ] *2)
             (_.map [ 1 2 3 ] /2)
             (_.map [ 1 2 3 ] ^2))

(console.log (format "(~~) (~~) (~~)" [ 1 2 3 ] ))
(console.log (format "(~foo~) (~bar~)" { bar 7 foo 8 } ))