class ApiError extends Error{

    constructor(
        statusCode,
        message="Something went wrong Vijender",
        error=[],
        stack=""
    )
    {
        super(message ||"Something went wrong vizi")
        this.statusCode=statusCode
        this.message=message;
        this.data=null;
        this.success=false;
        // this.errors=errors;
        if(stack){
            this.stack=stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }


    }
}
export{ApiError}