(def questionable-code
     (# (input)
        (console.log "doing stuff..")
        (when (= input "unexpected input")
          (throw "This wasn't supposed to happen"))
        (console.log "more stuff..")))

(def trying-things
     (# (input)
        (attempt
         (try
          (questionable-code input))
         (catch e
           (console.log "got error: " e))
         (finally
          (console.log "this should run whether there was an error or not")))))

(trying-things "foo")
(trying-things "unexpected input")
