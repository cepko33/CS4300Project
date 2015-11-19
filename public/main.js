(function() {
  var THREE, _, amplitude, blocks, createGame, createMesh, delta, fft, game, generator, i, length, materials, matter, mode, pd, pulsingHelix, songs, sound, theta, travelDir, traveller, voxel;

  createGame = require('voxel-engine');

  voxel = require('voxel');

  _ = require('lodash');

  createMesh = function(x, y, z, size, material) {
    var item, mesh;
    if (size == null) {
      size = 1;
    }
    if (material == null) {
      material = "grass_top";
    }
    mesh = new THREE.Mesh(new THREE.CubeGeometry(size, size, size), game.materials.material);
    game.materials.paint(mesh, material);
    mesh.position.set(x, y, z);
    item = game.addItem({
      mesh: mesh,
      size: 1
    });
    return item;
  };

  materials = ["dirt", "grass_top", "leaves_opaque"];

  game = createGame({
    chunkSize: 32,
    materials: materials,
    materialFlatColor: false
  });

  THREE = game.THREE;

  game.paused = true;

  game.appendTo(document.body);

  generator = function(x, y, z) {
    if (x * x + y * y <= 10 * 10) {
      return 1;
    } else {
      return 0;
    }
  };

  window.game = game;

  songs = ["casin.mp3", "ecozones.mp3", "lone.mp3"];

  sound = new p5.SoundFile(songs[1], function(file) {
    file.play();
    return game.paused = false;
  });

  amplitude = new p5.Amplitude();

  fft = new p5.FFT();

  pd = new p5.PeakDetect();

  i = 0;

  delta = 0;

  theta = 0;

  blocks = [];

  length = 50;

  traveller = -(length / 2);

  pulsingHelix = function(length, amp, traveller, matter) {
    var j, mod, ref, ref1, x, y, z;
    blocks = [];
    for (x = j = ref = -(length / 2), ref1 = length / 2; ref <= ref1 ? j <= ref1 : j >= ref1; x = ref <= ref1 ? ++j : --j) {
      y = function(x, d) {
        if (d == null) {
          d = 0;
        }
        return Math.sin(x / (9 / (1 - amp * .3)) + i + d) * 10;
      };
      z = function(x, d) {
        if (d == null) {
          d = 0;
        }
        return Math.cos(x / 9 + i + d) * 10;
      };
      mod = (x + traveller) % 10;
      if (mod === 0) {
        if (amp > 1) {
          amp = 1;
        }
        blocks.push(createMesh(x / 2, y(x), z(x) - 40, 1 + Math.floor(amp * 2), materials[matter]));
      } else {
        blocks.push(createMesh(x / 2, y(x), z(x) - 40, 1, materials[matter]));
      }
    }
    return blocks;
  };

  mode = 0;

  matter = 0;

  travelDir = 0;

  game.on('tick', function(d) {
    var amp, bass, treb, zeta;
    delta += d;
    theta += d;
    zeta += d;
    if (delta > 100) {
      if (travelDir === 0 && traveller++ > length / 2) {
        traveller = -(length / 2);
      }
      if (travelDir === 1 && traveller-- < -(length / 2)) {
        traveller = length / 2;
      }
      delta = 0;
    }
    if (zeta > 15000) {
      travelDir = (travelDir + 1) % 2;
      zeta = 0;
    }
    if (theta > 10000) {
      mode = (mode + 1) % 2;
      matter = (matter + 1) % materials.length;
      theta = 0;
    }
    _.forEach(blocks, function(n) {
      return game.removeItem(n);
    });
    blocks = [];
    fft.analyze();
    bass = (fft.getEnergy("bass")) / 256;
    treb = (fft.getEnergy("treble")) / 256;
    amp = amplitude.getLevel();
    i += d / 1000;
    return blocks = (function() {
      switch (mode) {
        case 0:
          return pulsingHelix(Math.ceil(length + (length * bass * 2)), treb * 2, traveller, matter);
        case 1:
          return pulsingHelix(Math.ceil(length * 2), bass / 2 + treb, Math.floor(traveller * 2), matter);
      }
    })();
  });

  return game;

}).call(this);
