import { GameObject } from '../GameObject';
import * as PIXI from 'pixi.js';
import { GameObjectBehavior } from './GameObjectBehavior';
import { EventDispatcher } from '../../EventDispatcher';
import { GameEvents } from '../../GameEvents';



export class ShotBehavior extends GameObjectBehavior {
    protected destroyerRef: GameObject;    
    private velocity: number = 6;

    constructor(gameObjRef: GameObject) {
        super(gameObjRef)
    }

    public update(deltaTime: number) {            
                this.move(deltaTime);            
        }

    public destroy() {}
    private onKeyDown(e: any) {
                
            if(e.code === "Space") {                
                this.destroyerRef = this.gameObjRef.getGameViewRef().getGameObjectById("destroyer") as GameObject;
                this.gameObjRef.x = this.destroyerRef.x + (this.destroyerRef.width * 0.5);
                this.gameObjRef.y = this.destroyerRef.y - (this.gameObjRef.height * 0.5);                
            }
            
    }

    protected init() {        
        this.onKeyDown = this.onKeyDown.bind(this);
        document.addEventListener("keydown", this.onKeyDown);
        
    }         

    private move(deltaTime: number) {    
        this.gameObjRef.y -= this.velocity * deltaTime;        
     }
        
}