export class ExpiredTokenError extends Error{

    constructor(message:string){
        super(message)

        Object.setPrototypeOf(this, new.target.prototype)
    }
}