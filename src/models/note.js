export class Note{
    constructor(description, createdOn, endsOn){
        this.description = description;
        this.createdOn = createdOn;
        this.endsOn = endsOn;
    }

    getCreatedOn(){
        return this.createdOn;
    }

    getDescription(){
        return this.description;
    }

    getId(){
        return this.id;
    }

    setId(id){
        this.id = id;
    }

    setDescription(description){
        this.description = description;
    }

    setCreatedOn(createdOn){
        this.createdOn = createdOn;
    }

    getEndsOn(){
        return this.endsOn;
    }

    setEndsOn(endsOn){
        this.endsOn = endsOn;
    }

}