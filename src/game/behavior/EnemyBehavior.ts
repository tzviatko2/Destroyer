import { GameObjectBehavior } from "./GameObjectBehavior";
import { GameObject } from "../GameObject";
import { EventDispatcher } from "../../EventDispatcher";
import { GameEvents } from "../../GameEvents";
import { GameApplication } from "../../GameApplication";

export class EnemyBehavior extends GameObjectBehavior {

constructor(gameObjRef: GameObject) {
    super(gameObjRef);
}
public update(deltaTime: number) {
    
        this.move(deltaTime);
    
}

     private velocity: number = 2;
     private move(deltaTime: number) {
        this.gameObjRef.y += this.velocity * deltaTime;
        if(this.gameObjRef.y > GameApplication.STAGE_HEIGHT) {
            EventDispatcher.getInstance().getDispatcher().emit(GameEvents.OBJECT_HIDE, {objId: this.gameObjRef.getId()});
            
        }
    }
    protected init() {
        EventDispatcher.getInstance().getDispatcher().addListener(GameEvents.ENEMY_HIT, this.onEnemyHit, this);
    }
    private onEnemyHit(e: any) {
        if(e.objId === this.gameObjRef.getId()) {
            EventDispatcher.getInstance().getDispatcher().emit(GameEvents.OBJECT_HIDE, {objId: this.gameObjRef.getId()});
        }    
    }
}