class customError extends Error{
    statusCode: number;

    constructor(message:string, statusCode:number){
        super(message);
        this.statusCode=statusCode;
        this.name="CustomError"
        Object.setPrototypeOf(this, customError.prototype);
    }
}

const isError=(err:unknown):Error=>{
    if(err instanceof Error)
        return err;

    let msg='something went wrong';
    try{
        msg=JSON.stringify(err);
    }catch{}

    const error= new Error(msg);
    return error;
}


export {customError, isError}