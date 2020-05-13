import GameObject from './GameObject';
import * as THREE from 'three';

export default class Player extends GameObject {
  constructor(pos, modelMesh) {
    super(pos, modelMesh);

    // Custom model updates
    modelMesh.scale.sub(new THREE.Vector3(0.95, 0.95, 0.95));
    modelMesh.name = 'PlayerSpaceship';
    modelMesh.rotation.y = 3.14;
  }

  moveRight = (vel) => {
    this.setVel(vel);
    this.mesh.rotation.x = 10;
  };

  // Update state of player
  update(dt) {
    super.update(dt);

    // Boundary checks
    const topX = 55;
    const floorX = -75;
    const topY = 70;
    const floorY = -25;
    const topZ = 430;
    const floorZ = 350;

    const pos = this.pos;
    pos.x = Math.min(pos.x, topX);
    pos.x = Math.max(pos.x, floorX);
    pos.y = Math.min(pos.y, topY);
    pos.y = Math.max(pos.y, floorY);
    pos.z = Math.min(pos.z, topZ);
    pos.z = Math.max(pos.z, floorZ);

    // Update mesh position
    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
  }
}
