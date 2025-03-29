// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TodoList {
    struct Todo {
        uint id;
        string text;
        bool completed;
    }

    Todo[] public todos;
    uint public nextId;

    function createTodo(string memory text) public {
        todos.push(Todo(nextId, text, false));
        nextId++;
    }

    function toggleTodoCompleted(uint id) public {
        Todo storage todo = todos[id];
        todo.completed = !todo.completed;
    }

    function getTodos() public view returns (Todo[] memory) {
        return todos;
    }
}
