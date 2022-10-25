export class Model {
    
    private score: number = 0;    

    private static instance: Model;

    public static getInstance(): Model {
        if(!this.instance) {
            this.instance = new Model();
        }

        return this.instance;
    }
    
    public resetGame() {        
        this.score = 0;        
    }
       
    public getScore(): number {
        return this.score;
    }

    public addScore(score: number) {
        this.score += score;
    }
}