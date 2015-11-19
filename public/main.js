(function() {
  var THREE, _, amplitude, blocks, createGame, createMesh, delta, game, generator, i, length, sound, traveller, voxel;

  createGame = require('voxel-engine');

  voxel = require('voxel');

  _ = require('lodash');

  game = createGame({
    chunkSize: 32,
    materials: ["dirt"],
    materialFlatColor: false
  });

  THREE = game.THREE;

  game.paused = false;

  game.appendTo(document.body);

  generator = function(x, y, z) {
    if (x * x + y * y <= 10 * 10) {
      return 1;
    } else {
      return 0;
    }
  };

  window.game = game;

  sound = new p5.SoundFile("lone.mp3", function(file) {
    return file.play();
  });

  amplitude = new p5.Amplitude();

  window.sound = sound;

  createMesh = function(x, y, z, size, material) {
    var item, mesh;
    if (size == null) {
      size = 1;
    }
    if (material == null) {
      material = "dirt";
    }
    mesh = new THREE.Mesh(new THREE.CubeGeometry(size, size, size), game.materials.material);
    game.materials.paint(mesh, "dirt");
    mesh.position.set(x, y, z);
    item = game.addItem({
      mesh: mesh,
      size: 1
    });
    return item;
  };

  i = 0;

  delta = 0;

  blocks = [];

  length = 50;

  traveller = -(length / 2);

  game.on('tick', function(d) {
    var amp, j, ref, ref1, results, x, y, z;
    delta += d;
    if (delta > 100) {
      if (traveller++ > length / 2) {
        traveller = -(length / 2);
      }
      delta = 0;
    }
    _.forEach(blocks, function(n) {
      return game.removeItem(n);
    });
    blocks = [];
    amp = amplitude.getLevel();
    i += (d / 10000) + (amp / 10);
    results = [];
    for (x = j = ref = -(length / 2), ref1 = length / 2; ref <= ref1 ? j <= ref1 : j >= ref1; x = ref <= ref1 ? ++j : --j) {
      amp = amplitude.getLevel();
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
      if ((x + traveller) % 10 === 0) {
        results.push(blocks.push(createMesh(x / 2, y(x), z(x) - 40, 1 + Math.floor(amp * 5))));
      } else {
        results.push(blocks.push(createMesh(x / 2, y(x), z(x) - 40)));
      }
    }
    return results;
  });

  return game;

}).call(this);
