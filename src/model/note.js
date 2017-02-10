export class Note{
    constructor(title, description, createdOn){
        this.title = title;
        this.description = description;
        this.createdOn = createdOn;
    }

    getCreatedOn(){
        return this.createdOn;
    }

    getTitle(){
        return this.title;
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

    setTitle(title){
        this.title = title;
    }

}