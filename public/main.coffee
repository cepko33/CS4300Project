createGame = require 'voxel-engine'
voxel = require 'voxel'
_ = require 'lodash'

game = createGame(
  chunkSize: 32
  materials:["dirt"]
  materialFlatColor: false
)

THREE = game.THREE

game.paused = false

game.appendTo(document.body)

generator = (x,y,z) ->
  return if (x*x + y*y <= 10*10) then 1 else 0

window.game = game


sound = new p5.SoundFile("lone.mp3", (file) ->
  file.play()
)

amplitude = new p5.Amplitude()
#amplitude.setInput(sound)

window.sound = sound

createMesh = (x, y, z, size = 1, material = "dirt") ->
  mesh = new THREE.Mesh(new THREE.CubeGeometry(size, size, size), game.materials.material)
  #mesh = new THREE.Mesh(new THREE.CubeGeometry(1,1,1), new THREE.MeshLambertMaterial
  #color: "#420420")
  game.materials.paint(mesh, "dirt")
  mesh.position.set(x, y, z)
  item = game.addItem(
    mesh: mesh
    size: 1
  )
  return item

i = 0
delta = 0

blocks = []
length = 50
traveller = -(length/2)

game.on 'tick', (d) ->

  delta += d

  if delta > 100
    if traveller++ > length/2
      traveller =  -(length/2)
    delta = 0


  _.forEach(blocks, (n) ->
    #game.setBlock(n, 0)
    game.removeItem(n)
  )

  blocks = []

  amp = amplitude.getLevel()
  i += (d / 10000) + (amp / 10)



  for x in [-(length / 2)..(length / 2)]
    amp = amplitude.getLevel()
    y = (x, d = 0) ->
      Math.sin(x/(9 / (1 - amp * .3)) + i + d) * 10
    z = (x, d = 0) ->
      Math.cos(x/9 + i + d) * 10

    #loc = [x/2, y(x), z(x) - 40]

    if (x + traveller) % 10 == 0
      blocks.push(createMesh(x/2, y(x), z(x) - 40, 1 + Math.floor(amp * 5)))

    else
      blocks.push(createMesh(x/2, y(x), z(x) - 40))


    #blocks.push(createMesh(x/2 - 15, y(x), z(x) - 40))
    #game.setBlock(loc, 1)
    #blocks.push(loc)

return game
