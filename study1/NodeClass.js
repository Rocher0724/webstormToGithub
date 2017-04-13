function Clazz(msg) {
    this.name = 'I am Class';
    this.message = msg;

}

Clazz.prototype.setMessage = function (msg) {
    this.message = msg;
} 

Clazz.prototype.getMessage = function () {
    return this.message;
}
Clazz.prototype.setNumber = function (num) {
    this.number = num;
}
Clazz.prototype.getNumber = function () {
    return this.number;
}
module.exports = Clazz;