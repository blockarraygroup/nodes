var Register = artifacts.require("Register");

contract('Register', function(accounts) {
    var instance;
    Register.deployed().then(function(inst) {
        instance = inst;
    });
    it("should register the creator", function() {
        return instance.getUser.call(accounts[0])
        .then(function(user) {
            console.log(user);
        });
    });
    it("should register a new user", function() {
        return instance.register("Bob", "Johnson",
                                 "bjohn@a.com", {from: accounts[1]})
        .then(function(result) {
            return instance.getUser.call(accounts[1])
            .then(function(user) {
                console.log(user);
            });
        })
    })
});