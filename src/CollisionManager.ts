
import * as PIXI from "pixi.js";
import { GameObject} from "./game/GameObject"
import { EventDispatcher } from "./EventDispatcher";
import { GameEvents } from "./GameEvents";

export class CollisionManager {

  private enemyList: Array<GameObject> = [];
  private shotRef: GameObject;
  private destroyerRef: GameObject;

  constructor() {

  }
  

  public unregisterBrickObject(brickID: string) {
    this.enemyList.forEach((obj, i) => {
      if(obj.getId() === brickID) {
        this.enemyList.splice(i, 1);
        return;
      }
    })
  }

  public registerBrickObject(gameObj: GameObject) {
    this.enemyList.push(gameObj);
  }

  public registerShot(gameObj: GameObject) {
    this.shotRef = gameObj;
    
  }

  public registerDestroyer(gameObj: GameObject) {
    this.destroyerRef = gameObj;
  }

  public update() {    
    if(!this.shotRef) {
      return;
    }

    const ballRect: PIXI.Rectangle = new PIXI.Rectangle(this.shotRef.x - this.shotRef.width, this.shotRef.y - this.shotRef.width, this.shotRef.width, this.shotRef.height );
    const destroyerRect: PIXI.Rectangle = new PIXI.Rectangle(this.destroyerRef.x - this.destroyerRef.width, this.destroyerRef.y - this.destroyerRef.width, this.destroyerRef.width, this.destroyerRef.height );
    this.enemyList.forEach((obj) => {
      const brickRect: PIXI.Rectangle = new PIXI.Rectangle(obj.x, obj.y, obj.width, obj.height);

      if(ballRect.left <= brickRect.right &&
        brickRect.left <= ballRect.right &&
        ballRect.top <= brickRect.bottom &&
        brickRect.top <= ballRect.bottom) {        
          EventDispatcher.getInstance().getDispatcher().emit(GameEvents.ENEMY_HIT, {objId: obj.getId()});          
        }
        
         if(destroyerRect.left <= brickRect.right &&
            brickRect.left <= destroyerRect.right &&
            destroyerRect.top <= brickRect.bottom &&
            brickRect.top <= destroyerRect.bottom ) { 
            
            EventDispatcher.getInstance().getDispatcher().emit(GameEvents.OBJECT_HIDE, {objId: this.destroyerRef.getId()});            
          } 
    });
  }
}