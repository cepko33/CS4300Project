createGame = require('voxel-engine')
game = createGame(
  generate: (x,y,z) ->
    if x > 5 then 1
  materials: ["stuff"]
)
game.appendTo(document.body)
