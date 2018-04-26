pragma solidity ^0.4.23;
pragma experimental ABIEncoderV2;


contract Register {

    struct User {
        string first;
        string last;
        string email;
        //string other;
    }

    mapping(address => User) users;

    constructor(string _creator) public {
        users[msg.sender] = User(_creator, "Here", "-");
    }

    function register(
        string _first,
        string _last,
        string _email
    ) public {
        users[msg.sender] = User(_first, _last, _email);
        assert(strcmp(users[msg.sender].first, _first));
        assert(strcmp(users[msg.sender].last, _last));
        assert(strcmp(users[msg.sender].email, _email));
    }

    function getUser(
        address _of
    ) public view returns (
        string first,
        string last,
        string email
    ) {
        require(_of != 0x0);
        User storage u = users[_of];
        return (u.first, u.last, u.email);
    }

    function strcmp(
        string a,
        string b
    ) public pure returns (bool) {
        return (keccak256(a) == keccak256(b));
    }

}