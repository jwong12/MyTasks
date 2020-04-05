module.exports = class Task {
    constructor(body) {
        this.title = body.title;
        this.description = body.description;
        this.datefrom = body.datefrom;
        this.dateto = body.dateto;
        this.priority = body.priority;
        this.category = body.category;
        this.status = body.status;
    }
}