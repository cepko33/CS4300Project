createGame = require 'voxel-engine'
voxel = require 'voxel'
_ = require 'lodash'

createMesh = (x, y, z, size = 1, material = "grass_top") ->
  mesh = new THREE.Mesh(new THREE.CubeGeometry(size, size, size), game.materials.material)
  #mesh = new THREE.Mesh(new THREE.CubeGeometry(1,1,1), new THREE.MeshLambertMaterial
  #color: "#420420")
  game.materials.paint(mesh, material)
  mesh.position.set(x, y, z)
  item = game.addItem(
    mesh: mesh
    size: 1
  )
  return item

materials = ["dirt", "grass_top", "leaves_opaque"]

game = createGame(
  chunkSize: 32
  materials: materials
  materialFlatColor: false
)

THREE = game.THREE

game.paused = true

game.appendTo(document.body)

generator = (x,y,z) ->
  return if (x*x + y*y <= 10*10) then 1 else 0

window.game = game

songs = ["casin.mp3", "ecozones.mp3", "lone.mp3"]

#sound = new p5.SoundFile(songs[Math.floor(Math.random() * 3)], (file) ->
sound = new p5.SoundFile(songs[1], (file) ->
  file.play()
  game.paused = false
)

amplitude = new p5.Amplitude()
fft = new p5.FFT()
pd = new p5.PeakDetect()

i = 0
delta = 0
theta = 0

blocks = []

length = 50
traveller = -(length/2)

pulsingHelix = (length, amp, traveller, matter) ->
  blocks = []

  for x in [-(length / 2)..(length / 2)]

    y = (x, d = 0) ->
      Math.sin(x/(9 / (1 - amp * .3)) + i + d) * 10
    z = (x, d = 0) ->
      Math.cos(x/9 + i + d) * 10

    mod = (x + traveller) % 10

    if mod == 0
      if amp > 1
        amp = 1
      blocks.push(createMesh(x/2, y(x), z(x) - 40, 1 + Math.floor(amp * 2), materials[matter]))
    else
      blocks.push(createMesh(x/2, y(x), z(x) - 40, 1, materials[matter]))
  return blocks


mode = 0
matter = 0
travelDir = 0

game.on 'tick', (d) ->

  delta += d
  theta += d
  zeta += d

  if delta > 100
    if travelDir is 0 and traveller++ > length/2
      traveller =  -(length/2)
    if travelDir is 1 and traveller-- < -(length/2)
      traveller =  (length/2)
    delta = 0

  if zeta > 15000
    travelDir = (travelDir + 1) % 2
    zeta = 0

  if theta > 10000
    mode = (mode + 1) % 2
    matter = (matter + 1) % materials.length
    theta = 0

  _.forEach(blocks, (n) ->
    #game.setBlock(n, 0)
    game.removeItem(n)
  )

  blocks = []

  #wav = fft.waveform()
  fft.analyze()
  bass = (fft.getEnergy("bass")) / 256
  treb = (fft.getEnergy("treble")) / 256
  amp = amplitude.getLevel()
  i += (d / 1000)
  blocks = switch mode
    when 0 then pulsingHelix(Math.ceil(length + (length * bass * 2)), treb * 2, traveller, matter)
    when 1 then pulsingHelix(Math.ceil(length * 2), bass / 2 + treb, Math.floor(traveller * 2), matter)

return game
