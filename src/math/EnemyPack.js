import * as THREE from 'three';
import Enemy from '../physics/Enemy';
import { Vector } from 'simple-physics-engine';

export default class EnemyPack {
  pos; // the enemy in the pack will be equally distributed around this pack position
  enemies;
  enemiesPos;
  size;
  side;

  constructor(pos, size, side = 0) {
    this.size = size;
    this.pos = pos;
    this.side = side;
    this.enemies = [];
    this.enemiesPos = [];
    // Enemies designated spots
    // this.enemiesPos.push(new Vector(-140, -20, 200));
    // this.enemiesPos.push(new Vector(-70, -20, 200));
    // this.enemiesPos.push(new Vector(0, -20, 200));
    // this.enemiesPos.push(new Vector(70, -20, 200));
    // this.enemiesPos.push(new Vector(140, -20, 200));
    // this.enemiesPos.push(new Vector(-140, -20, 150));
    // this.enemiesPos.push(new Vector(-70, -20, 150));
    // this.enemiesPos.push(new Vector(0, -20, 150));
    // this.enemiesPos.push(new Vector(70, -20, 150));
    // this.enemiesPos.push(new Vector(140, -20, 150));
    // this.enemiesPos.push(new Vector(-140, -20, 100));
    // this.enemiesPos.push(new Vector(-70, -20, 100));
    // this.enemiesPos.push(new Vector(0, -20, 100));
    // this.enemiesPos.push(new Vector(70, -20, 100));
    // this.enemiesPos.push(new Vector(140, -20, 100));
    this.generatePack();
  }

  generatePack = () => {
    let x;
    let z;
    if (this.side === 0) {
      this.side = this.randInt(1, 4);
    }
    if (this.side === 1) {
      // left of screen
      x = this.rand(-1400, -1200);
      z = this.rand(-200, 200);
    }
    if (this.side === 2) {
      // right of screen
      x = this.rand(1200, 1400);
      z = this.rand(-200, 200);
    }
    for (let i = 0; i < this.size; i++) {
      let enemyInitPos = new Vector(x + i * 20, 40 * i, z + i * 20);
      let enemy = new Enemy(enemyInitPos);
      enemy.setDesignatedPos(70 * i + this.pos.x, this.pos.z);
      this.enemies.push(enemy);
      enemy.getCollider(); // needed for some reason to reset collider and get it working
    }
  };

  to1D = (m, n) => {
    return 5 * m + n;
  };

  rand = (min, max) => {
    return Math.random() * (max - min) + min;
  };

  randInt = (min, max) => {
    return Math.floor(this.rand(min, max));
  };

  pulse = () => {
    // pulse animations for all enemies
  };
}
