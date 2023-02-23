export const MATH_COMMAND = {
    name: 'math',
    description: 'A selection of math-based commands',
    options: [
        {
            "name": "add_numbers",
            "description": "Add two numbers together",
            "type": 1,
            options: [
                {
                    "name": "first_number",
                    "description": "The first number to add",
                    "type": 4, //integer
                    "required": true
                },
                {
                    "name": "second_number",
                    "description": "The second number to add",
                    "type": 4, //integer
                    "required": true
                }
            ]
        },
    ]
};
