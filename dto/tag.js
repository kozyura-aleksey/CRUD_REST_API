export default class Tag {
    /** @type {number} */
    #id;
    /** @type {uuid} */
    #creator;
    /** @type {string} */
    #name;
    #sortOrder;
    constructor(id, creator, name) {
        this.#id = id;
        this.creator = creator;
        this.name = name;
    }
}