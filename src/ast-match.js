/**
 * AST Match.
 */
(function(root) {

    var tv4 = root.tv4 || require('tv4');

    function importSchema(schema) {
        for(var prop in schema) {
            if(!schema[prop]['id']) {
                schema[prop]['id'] = prop;
            }
            tv4.addSchema(schema[prop]);
        }
    }

    function test(node, schema) {
        schema = typeof schema === 'object' ? schema : tv4.getSchema(schema);
        if(!schema) {
            throw new Error('Missed schema "' + schema '".');
        }
        return tv4.validateResult(node, schema).valid;
    }

    var schema = {
        "Node": {
            "type": "object",
            "properties": {
                "type": {
                    "type": "string"
                },
                "loc": {
                    "anyOf": [
                        {
                            "$ref": "SourceLocation"
                        },
                        {
                            "type": "null"
                        }
                    ]
                }
            },
            "required": [
                "type"
            ]
        },
        "SourceLocation": {
            "type": "object",
            "properties": {
                "source": {
                    "anyOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "null"
                        }
                    ]
                },
                "start": {
                    "$ref": "Position"
                },
                "end": {
                    "$ref": "Position"
                }
            },
            "required": [
                "start",
                "end"
            ]
        },
        "Position": {
            "type": "object",
            "properties": {
                "line": {
                    "type": "integer",
                    "minimum": 1
                },
                "column": {
                    "type": "integer",
                    "minimum": 0
                }
            },
            "required": [
                "line",
                "column"
            ]
        },
        "Program": {
            "allOf": [
                {
                    "$ref": "Node"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^Program$"
                        },
                        "body": {
                            "type": "array",
                            "items": {
                                "$ref": "Statement"
                            }
                        }
                    },
                    "required": [
                        "body"
                    ]
                }
            ]
        },
        "Function": {
            "allOf": [
                {
                    "$ref": "Node"
                },
                {
                    "properties": {
                        "id": {
                            "anyOf": [
                                {
                                    "$ref": "Identifier"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "params": {
                            "type": "array",
                            "items": {
                                "$ref": "Pattern"
                            }
                        },
                        "defaults": {
                            "type": "array",
                            "items": {
                                "$ref": "Expression"
                            }
                        },
                        "rest": {
                            "anyOf": [
                                {
                                    "$ref": "Identifier"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "body": {
                            "anyOf": [
                                {
                                    "$ref": "BlockStatement"
                                },
                                {
                                    "$ref": "Expression"
                                }
                            ]
                        },
                        "generator": {
                            "type": "boolean"
                        },
                        "expression": {
                            "type": "boolean"
                        }
                    },
                    "required": [
                        "id",
                        "params",
                        "defaults",
                        "rest",
                        "body",
                        "generator",
                        "expression"
                    ]
                }
            ]
        },
        "Statement": {
            "$ref": "Node"
        },
        "EmptyStatement": {
            "allOf": [
                {
                    "$ref": "Statement"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^EmptyStatement$"
                        }
                    }
                }
            ]
        },
        "BlockStatement": {
            "allOf": [
                {
                    "$ref": "Statement"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^BlockStatement$"
                        },
                        "body": {
                            "type": "array",
                            "items": {
                                "$ref": "Statement"
                            }
                        }
                    },
                    "required": [
                        "body"
                    ]
                }
            ]
        },
        "ExpressionStatement": {
            "allOf": [
                {
                    "$ref": "Statement"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^ExpressionStatement$"
                        },
                        "expression": {
                            "$ref": "Expression"
                        }
                    },
                    "required": [
                        "expression"
                    ]
                }
            ]
        },
        "IfStatement": {
            "allOf": [
                {
                    "$ref": "Statement"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^IfStatement$"
                        },
                        "test": {
                            "$ref": "Expression"
                        },
                        "consequent": {
                            "$ref": "Statement"
                        },
                        "alternate": {
                            "anyOf": [
                                {
                                    "$ref": "Statement"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "required": [
                        "test",
                        "consequent",
                        "alternate"
                    ]
                }
            ]
        },
        "LabeledStatement": {
            "allOf": [
                {
                    "$ref": "Statement"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^LabeledStatement$"
                        },
                        "label": {
                            "$ref": "Identifier"
                        },
                        "body": {
                            "$ref": "Statement"
                        }
                    },
                    "required": [
                        "label",
                        "body"
                    ]
                }
            ]
        },
        "BreakStatement": {
            "allOf": [
                {
                    "$ref": "Statement"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^BreakStatement$"
                        },
                        "label": {
                            "anyOf": [
                                {
                                    "$ref": "Identifier"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "required": [
                        "label"
                    ]
                }
            ]
        },
        "ContinueStatement": {
            "allOf": [
                {
                    "$ref": "Statement"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^ContinueStatement$"
                        },
                        "label": {
                            "anyOf": [
                                {
                                    "$ref": "Identifier"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "required": [
                        "label"
                    ]
                }
            ]
        },
        "WithStatement": {
            "allOf": [
                {
                    "$ref": "Statement"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^WithStatement$"
                        },
                        "object": {
                            "$ref": "Expression"
                        },
                        "body": {
                            "$ref": "Statement"
                        }
                    },
                    "required": [
                        "object",
                        "body"
                    ]
                }
            ]
        },
        "SwitchStatement": {
            "allOf": [
                {
                    "$ref": "Statement"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^SwitchStatement$"
                        },
                        "discriminant": {
                            "$ref": "Expression"
                        },
                        "cases": {
                            "type": "array",
                            "items": {
                                "$ref": "SwitchCase"
                            }
                        },
                        "lexical": {
                            "type": "boolean"
                        }
                    },
                    "required": [
                        "discriminant",
                        "cases",
                        "lexical"
                    ]
                }
            ]
        },
        "ReturnStatement": {
            "allOf": [
                {
                    "$ref": "Statement"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^ReturnStatement$"
                        },
                        "argument": {
                            "anyOf": [
                                {
                                    "$ref": "Expression"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "required": [
                        "argument"
                    ]
                }
            ]
        },
        "ThrowStatement": {
            "allOf": [
                {
                    "$ref": "Statement"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^ThrowStatement$"
                        },
                        "argument": {
                            "$ref": "Expression"
                        }
                    },
                    "required": [
                        "argument"
                    ]
                }
            ]
        },
        "TryStatement": {
            "allOf": [
                {
                    "$ref": "Statement"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^TryStatement$"
                        },
                        "block": {
                            "$ref": "BlockStatement"
                        },
                        "handler": {
                            "anyOf": [
                                {
                                    "$ref": "CatchClause"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "guardedHandlers": {
                            "type": "array",
                            "items": {
                                "$ref": "CatchClause"
                            }
                        },
                        "finalizer": {
                            "anyOf": [
                                {
                                    "$ref": "BlockStatement"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "required": [
                        "block",
                        "handler",
                        "guardedHandlers",
                        "finalizer"
                    ]
                }
            ]
        },
        "WhileStatement": {
            "allOf": [
                {
                    "$ref": "Statement"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^WhileStatement$"
                        },
                        "test": {
                            "$ref": "Expression"
                        },
                        "body": {
                            "$ref": "Statement"
                        }
                    },
                    "required": [
                        "test",
                        "body"
                    ]
                }
            ]
        },
        "DoWhileStatement": {
            "allOf": [
                {
                    "$ref": "Statement"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^DoWhileStatement$"
                        },
                        "body": {
                            "$ref": "Statement"
                        },
                        "test": {
                            "$ref": "Expression"
                        }
                    },
                    "required": [
                        "body",
                        "test"
                    ]
                }
            ]
        },
        "ForStatement": {
            "allOf": [
                {
                    "$ref": "Statement"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^ForStatement$"
                        },
                        "init": {
                            "anyOf": [
                                {
                                    "$ref": "VariableDeclaration"
                                },
                                {
                                    "$ref": "Expression"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "test": {
                            "anyOf": [
                                {
                                    "$ref": "Expression"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "update": {
                            "anyOf": [
                                {
                                    "$ref": "Expression"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "body": {
                            "$ref": "Statement"
                        }
                    },
                    "required": [
                        "init",
                        "test",
                        "update",
                        "body"
                    ]
                }
            ]
        },
        "ForInStatement": {
            "allOf": [
                {
                    "$ref": "Statement"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^ForInStatement$"
                        },
                        "left": {
                            "anyOf": [
                                {
                                    "$ref": "VariableDeclaration"
                                },
                                {
                                    "$ref": "Expression"
                                }
                            ]
                        },
                        "right": {
                            "$ref": "Expression"
                        },
                        "body": {
                            "$ref": "Statement"
                        },
                        "each": {
                            "type": "boolean"
                        }
                    },
                    "required": [
                        "left",
                        "right",
                        "body",
                        "each"
                    ]
                }
            ]
        },
        "ForOfStatement": {
            "allOf": [
                {
                    "$ref": "Statement"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^ForOfStatement$"
                        },
                        "left": {
                            "anyOf": [
                                {
                                    "$ref": "VariableDeclaration"
                                },
                                {
                                    "$ref": "Expression"
                                }
                            ]
                        },
                        "right": {
                            "$ref": "Expression"
                        },
                        "body": {
                            "$ref": "Statement"
                        }
                    },
                    "required": [
                        "left",
                        "right",
                        "body"
                    ]
                }
            ]
        },
        "LetStatement": {
            "allOf": [
                {
                    "$ref": "Statement"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^LetStatement$"
                        },
                        "head": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "id": {
                                        "$ref": "Pattern"
                                    },
                                    "init": {
                                        "anyOf": [
                                            {
                                                "$ref": "Expression"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        "body": {
                            "$ref": "Statement"
                        }
                    },
                    "required": [
                        "head",
                        "body"
                    ]
                }
            ]
        },
        "DebuggerStatement": {
            "allOf": [
                {
                    "$ref": "Statement"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^DebuggerStatement$"
                        }
                    }
                }
            ]
        },
        "Declaration": {
            "$ref": "Statement"
        },
        "FunctionDeclaration": {
            "allOf": [
                {
                    "$ref": "Function"
                },
                {
                    "$ref": "Declaration"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^FunctionDeclaration$"
                        },
                        "id": {
                            "$ref": "Identifier"
                        },
                        "params": {
                            "type": "array",
                            "items": {
                                "$ref": "Pattern"
                            }
                        },
                        "defaults": {
                            "type": "array",
                            "items": {
                                "$ref": "Expression"
                            }
                        },
                        "rest": {
                            "anyOf": [
                                {
                                    "$ref": "Identifier"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "body": {
                            "anyOf": [
                                {
                                    "$ref": "BlockStatement"
                                },
                                {
                                    "$ref": "Expression"
                                }
                            ]
                        },
                        "generator": {
                            "type": "boolean"
                        },
                        "expression": {
                            "type": "boolean"
                        }
                    },
                    "required": [
                        "id",
                        "params",
                        "defaults",
                        "rest",
                        "body",
                        "generator",
                        "expression"
                    ]
                }
            ]
        },
        "VariableDeclaration": {
            "allOf": [
                {
                    "$ref": "Declaration"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^VariableDeclaration$"
                        },
                        "declarations": {
                            "type": "array",
                            "items": {
                                "$ref": "VariableDeclarator"
                            }
                        },
                        "kind": {
                            "enum": [
                                "var",
                                "let",
                                "const"
                            ]
                        }
                    },
                    "required": [
                        "declarations",
                        "kind"
                    ]
                }
            ]
        },
        "VariableDeclarator": {
            "allOf": [
                {
                    "$ref": "Node"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^VariableDeclarator$"
                        },
                        "id": {
                            "$ref": "Pattern"
                        },
                        "init": {
                            "anyOf": [
                                {
                                    "$ref": "Expression"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "required": [
                        "id",
                        "init"
                    ]
                }
            ]
        },
        "Expression": {
            "allOf": [
                {
                    "$ref": "Node"
                },
                {
                    "$ref": "Pattern"
                }
            ]
        },
        "ThisExpression": {
            "allOf": [
                {
                    "$ref": "Expression"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^ThisExpression$"
                        }
                    }
                }
            ]
        },
        "ArrayExpression": {
            "allOf": [
                {
                    "$ref": "Expression"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^ArrayExpression$"
                        },
                        "elements": {
                            "type": "array",
                            "items": {
                                "anyOf": [
                                    {
                                        "$ref": "Expression"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            }
                        }
                    },
                    "required": [
                        "elements"
                    ]
                }
            ]
        },
        "ObjectExpression": {
            "allOf": [
                {
                    "$ref": "Expression"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^ObjectExpression$"
                        },
                        "properties": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "key": {
                                        "anyOf": [
                                            {
                                                "$ref": "Literal"
                                            },
                                            {
                                                "$ref": "Identifier"
                                            }
                                        ]
                                    },
                                    "value": {
                                        "$ref": "Expression"
                                    },
                                    "kind": {
                                        "enum": [
                                            "init",
                                            "get",
                                            "set"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    "required": [
                        "properties"
                    ]
                }
            ]
        },
        "FunctionExpression": {
            "allOf": [
                {
                    "$ref": "Function"
                },
                {
                    "$ref": "Expression"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^FunctionExpression$"
                        },
                        "id": {
                            "anyOf": [
                                {
                                    "$ref": "Identifier"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "params": {
                            "type": "array",
                            "items": {
                                "$ref": "Pattern"
                            }
                        },
                        "defaults": {
                            "type": "array",
                            "items": {
                                "$ref": "Expression"
                            }
                        },
                        "rest": {
                            "anyOf": [
                                {
                                    "$ref": "Identifier"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "body": {
                            "anyOf": [
                                {
                                    "$ref": "BlockStatement"
                                },
                                {
                                    "$ref": "Expression"
                                }
                            ]
                        },
                        "generator": {
                            "type": "boolean"
                        },
                        "expression": {
                            "type": "boolean"
                        }
                    },
                    "required": [
                        "id",
                        "params",
                        "defaults",
                        "rest",
                        "body",
                        "generator",
                        "expression"
                    ]
                }
            ]
        },
        "ArrowExpression": {
            "allOf": [
                {
                    "$ref": "Function"
                },
                {
                    "$ref": "Expression"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^ArrowExpression$"
                        },
                        "params": {
                            "type": "array",
                            "items": {
                                "$ref": "Pattern"
                            }
                        },
                        "defaults": {
                            "type": "array",
                            "items": {
                                "$ref": "Expression"
                            }
                        },
                        "rest": {
                            "anyOf": [
                                {
                                    "$ref": "Identifier"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "body": {
                            "anyOf": [
                                {
                                    "$ref": "BlockStatement"
                                },
                                {
                                    "$ref": "Expression"
                                }
                            ]
                        },
                        "generator": {
                            "type": "boolean"
                        },
                        "expression": {
                            "type": "boolean"
                        }
                    },
                    "required": [
                        "params",
                        "defaults",
                        "rest",
                        "body",
                        "generator",
                        "expression"
                    ]
                }
            ]
        },
        "SequenceExpression": {
            "allOf": [
                {
                    "$ref": "Expression"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^SequenceExpression$"
                        },
                        "expressions": {
                            "type": "array",
                            "items": {
                                "$ref": "Expression"
                            }
                        }
                    },
                    "required": [
                        "expressions"
                    ]
                }
            ]
        },
        "UnaryExpression": {
            "allOf": [
                {
                    "$ref": "Expression"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^UnaryExpression$"
                        },
                        "operator": {
                            "$ref": "UnaryOperator"
                        },
                        "prefix": {
                            "type": "boolean"
                        },
                        "argument": {
                            "$ref": "Expression"
                        }
                    },
                    "required": [
                        "operator",
                        "prefix",
                        "argument"
                    ]
                }
            ]
        },
        "BinaryExpression": {
            "allOf": [
                {
                    "$ref": "Expression"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^BinaryExpression$"
                        },
                        "operator": {
                            "$ref": "BinaryOperator"
                        },
                        "left": {
                            "$ref": "Expression"
                        },
                        "right": {
                            "$ref": "Expression"
                        }
                    },
                    "required": [
                        "operator",
                        "left",
                        "right"
                    ]
                }
            ]
        },
        "AssignmentExpression": {
            "allOf": [
                {
                    "$ref": "Expression"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^AssignmentExpression$"
                        },
                        "operator": {
                            "$ref": "AssignmentOperator"
                        },
                        "left": {
                            "$ref": "Expression"
                        },
                        "right": {
                            "$ref": "Expression"
                        }
                    },
                    "required": [
                        "operator",
                        "left",
                        "right"
                    ]
                }
            ]
        },
        "UpdateExpression": {
            "allOf": [
                {
                    "$ref": "Expression"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^UpdateExpression$"
                        },
                        "operator": {
                            "$ref": "UpdateOperator"
                        },
                        "argument": {
                            "$ref": "Expression"
                        },
                        "prefix": {
                            "type": "boolean"
                        }
                    },
                    "required": [
                        "operator",
                        "argument",
                        "prefix"
                    ]
                }
            ]
        },
        "LogicalExpression": {
            "allOf": [
                {
                    "$ref": "Expression"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^LogicalExpression$"
                        },
                        "operator": {
                            "$ref": "LogicalOperator"
                        },
                        "left": {
                            "$ref": "Expression"
                        },
                        "right": {
                            "$ref": "Expression"
                        }
                    },
                    "required": [
                        "operator",
                        "left",
                        "right"
                    ]
                }
            ]
        },
        "ConditionalExpression": {
            "allOf": [
                {
                    "$ref": "Expression"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^ConditionalExpression$"
                        },
                        "test": {
                            "$ref": "Expression"
                        },
                        "alternate": {
                            "$ref": "Expression"
                        },
                        "consequent": {
                            "$ref": "Expression"
                        }
                    },
                    "required": [
                        "test",
                        "alternate",
                        "consequent"
                    ]
                }
            ]
        },
        "NewExpression": {
            "allOf": [
                {
                    "$ref": "Expression"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^NewExpression$"
                        },
                        "callee": {
                            "$ref": "Expression"
                        },
                        "arguments": {
                            "type": "array",
                            "items": {
                                "$ref": "Expression"
                            }
                        }
                    },
                    "required": [
                        "callee",
                        "arguments"
                    ]
                }
            ]
        },
        "CallExpression": {
            "allOf": [
                {
                    "$ref": "Expression"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^CallExpression$"
                        },
                        "callee": {
                            "$ref": "Expression"
                        },
                        "arguments": {
                            "type": "array",
                            "items": {
                                "$ref": "Expression"
                            }
                        }
                    },
                    "required": [
                        "callee",
                        "arguments"
                    ]
                }
            ]
        },
        "MemberExpression": {
            "allOf": [
                {
                    "$ref": "Expression"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^MemberExpression$"
                        },
                        "object": {
                            "$ref": "Expression"
                        },
                        "property": {
                            "anyOf": [
                                {
                                    "$ref": "Identifier"
                                },
                                {
                                    "$ref": "Expression"
                                }
                            ]
                        },
                        "computed": {
                            "type": "boolean"
                        }
                    },
                    "required": [
                        "object",
                        "property",
                        "computed"
                    ]
                }
            ]
        },
        "YieldExpression": {
            "allOf": [
                {
                    "$ref": "Expression"
                },
                {
                    "properties": {
                        "argument": {
                            "anyOf": [
                                {
                                    "$ref": "Expression"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "required": [
                        "argument"
                    ]
                }
            ]
        },
        "ComprehensionExpression": {
            "allOf": [
                {
                    "$ref": "Expression"
                },
                {
                    "properties": {
                        "body": {
                            "$ref": "Expression"
                        },
                        "blocks": {
                            "type": "array",
                            "items": {
                                "$ref": "ComprehensionBlock"
                            }
                        },
                        "filter": {
                            "anyOf": [
                                {
                                    "$ref": "Expression"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "required": [
                        "body",
                        "blocks",
                        "filter"
                    ]
                }
            ]
        },
        "GeneratorExpression": {
            "allOf": [
                {
                    "$ref": "Expression"
                },
                {
                    "properties": {
                        "body": {
                            "$ref": "Expression"
                        },
                        "blocks": {
                            "type": "array",
                            "items": {
                                "$ref": "ComprehensionBlock"
                            }
                        },
                        "filter": {
                            "anyOf": [
                                {
                                    "$ref": "Expression"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "required": [
                        "body",
                        "blocks",
                        "filter"
                    ]
                }
            ]
        },
        "GraphExpression": {
            "allOf": [
                {
                    "$ref": "Expression"
                },
                {
                    "properties": {
                        "index": {
                            "type": "integer"
                        },
                        "expression": {
                            "$ref": "Literal"
                        }
                    },
                    "required": [
                        "index",
                        "expression"
                    ]
                }
            ]
        },
        "GraphIndexExpression": {
            "allOf": [
                {
                    "$ref": "Expression"
                },
                {
                    "properties": {
                        "index": {
                            "type": "integer"
                        }
                    },
                    "required": [
                        "index"
                    ]
                }
            ]
        },
        "LetExpression": {
            "allOf": [
                {
                    "$ref": "Expression"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^LetExpression$"
                        },
                        "head": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "id": {
                                        "$ref": "Pattern"
                                    },
                                    "init": {
                                        "anyOf": [
                                            {
                                                "$ref": "Expression"
                                            },
                                            {
                                                "type": "null"
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        "body": {
                            "$ref": "Expression"
                        }
                    },
                    "required": [
                        "head",
                        "body"
                    ]
                }
            ]
        },
        "Pattern": {
            "$ref": "Node"
        },
        "ObjectPattern": {
            "allOf": [
                {
                    "$ref": "Pattern"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^ObjectPattern$"
                        },
                        "properties": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "key": {
                                        "$ref": "Literal"
                                    },
                                    "value": {
                                        "$ref": "Pattern"
                                    }
                                }
                            }
                        }
                    },
                    "required": [
                        "properties"
                    ]
                }
            ]
        },
        "ArrayPattern": {
            "allOf": [
                {
                    "$ref": "Pattern"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^ArrayPattern$"
                        },
                        "elements": {
                            "type": "array",
                            "items": {
                                "anyOf": [
                                    {
                                        "$ref": "Pattern"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            }
                        }
                    },
                    "required": [
                        "elements"
                    ]
                }
            ]
        },
        "SwitchCase": {
            "allOf": [
                {
                    "$ref": "Node"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^SwitchCase$"
                        },
                        "test": {
                            "anyOf": [
                                {
                                    "$ref": "Expression"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "consequent": {
                            "type": "array",
                            "items": {
                                "$ref": "Statement"
                            }
                        }
                    },
                    "required": [
                        "test",
                        "consequent"
                    ]
                }
            ]
        },
        "CatchClause": {
            "allOf": [
                {
                    "$ref": "Node"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^CatchClause$"
                        },
                        "param": {
                            "$ref": "Pattern"
                        },
                        "guard": {
                            "anyOf": [
                                {
                                    "$ref": "Expression"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        },
                        "body": {
                            "$ref": "BlockStatement"
                        }
                    },
                    "required": [
                        "param",
                        "guard",
                        "body"
                    ]
                }
            ]
        },
        "ComprehensionBlock": {
            "allOf": [
                {
                    "$ref": "Node"
                },
                {
                    "properties": {
                        "left": {
                            "$ref": "Pattern"
                        },
                        "right": {
                            "$ref": "Expression"
                        },
                        "each": {
                            "type": "boolean"
                        }
                    },
                    "required": [
                        "left",
                        "right",
                        "each"
                    ]
                }
            ]
        },
        "Identifier": {
            "allOf": [
                {
                    "$ref": "Node"
                },
                {
                    "$ref": "Expression"
                },
                {
                    "$ref": "Pattern"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^Identifier$"
                        },
                        "name": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "name"
                    ]
                }
            ]
        },
        "Literal": {
            "allOf": [
                {
                    "$ref": "Node"
                },
                {
                    "$ref": "Expression"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^Literal$"
                        },
                        "value": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "boolean"
                                },
                                {
                                    "type": "null"
                                },
                                {
                                    "type": "number"
                                }
                            ]
                        }
                    },
                    "required": [
                        "value"
                    ]
                }
            ]
        },
        "XMLDefaultDeclaration": {
            "allOf": [
                {
                    "$ref": "Declaration"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^XMLDefaultDeclaration$"
                        },
                        "namespace": {
                            "$ref": "Expression"
                        }
                    },
                    "required": [
                        "namespace"
                    ]
                }
            ]
        },
        "XMLAnyName": {
            "allOf": [
                {
                    "$ref": "Expression"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^XMLAnyName$"
                        }
                    }
                }
            ]
        },
        "XMLQualifiedIdentifier": {
            "allOf": [
                {
                    "$ref": "Expression"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^XMLQualifiedIdentifier$"
                        },
                        "left": {
                            "anyOf": [
                                {
                                    "$ref": "Identifier"
                                },
                                {
                                    "$ref": "XMLAnyName"
                                }
                            ]
                        },
                        "right": {
                            "anyOf": [
                                {
                                    "$ref": "Identifier"
                                },
                                {
                                    "$ref": "Expression"
                                }
                            ]
                        },
                        "computed": {
                            "type": "boolean"
                        }
                    },
                    "required": [
                        "left",
                        "right",
                        "computed"
                    ]
                }
            ]
        },
        "XMLFunctionQualifiedIdentifier": {
            "allOf": [
                {
                    "$ref": "Expression"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^XMLFunctionQualifiedIdentifier$"
                        },
                        "right": {
                            "anyOf": [
                                {
                                    "$ref": "Identifier"
                                },
                                {
                                    "$ref": "Expression"
                                }
                            ]
                        },
                        "computed": {
                            "type": "boolean"
                        }
                    },
                    "required": [
                        "right",
                        "computed"
                    ]
                }
            ]
        },
        "XMLAttributeSelector": {
            "allOf": [
                {
                    "$ref": "Expression"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^XMLAttributeSelector$"
                        },
                        "attribute": {
                            "$ref": "Expression"
                        }
                    },
                    "required": [
                        "attribute"
                    ]
                }
            ]
        },
        "XMLFilterExpression": {
            "allOf": [
                {
                    "$ref": "Expression"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^XMLFilterExpression$"
                        },
                        "left": {
                            "$ref": "Expression"
                        },
                        "right": {
                            "$ref": "Expression"
                        }
                    },
                    "required": [
                        "left",
                        "right"
                    ]
                }
            ]
        },
        "XMLElement": {
            "allOf": [
                {
                    "$ref": "XML"
                },
                {
                    "$ref": "Expression"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^XMLElement$"
                        },
                        "contents": {
                            "type": "array",
                            "items": {
                                "$ref": "XML"
                            }
                        }
                    },
                    "required": [
                        "contents"
                    ]
                }
            ]
        },
        "XMLList": {
            "allOf": [
                {
                    "$ref": "XML"
                },
                {
                    "$ref": "Expression"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^XMLList$"
                        },
                        "contents": {
                            "type": "array",
                            "items": {
                                "$ref": "XML"
                            }
                        }
                    },
                    "required": [
                        "contents"
                    ]
                }
            ]
        },
        "XML": {
            "$ref": "Node"
        },
        "XMLEscape": {
            "allOf": [
                {
                    "$ref": "XML"
                },
                {
                    "properties": {
                        "expression": {
                            "$ref": "Expression"
                        }
                    },
                    "required": [
                        "expression"
                    ]
                }
            ]
        },
        "XMLText": {
            "allOf": [
                {
                    "$ref": "XML"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^XMLText$"
                        },
                        "text": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "text"
                    ]
                }
            ]
        },
        "XMLStartTag": {
            "allOf": [
                {
                    "$ref": "XML"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^XMLStartTag$"
                        },
                        "contents": {
                            "type": "array",
                            "items": {
                                "$ref": "XML"
                            }
                        }
                    },
                    "required": [
                        "contents"
                    ]
                }
            ]
        },
        "XMLEndTag": {
            "allOf": [
                {
                    "$ref": "XML"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^XMLEndTag$"
                        },
                        "contents": {
                            "type": "array",
                            "items": {
                                "$ref": "XML"
                            }
                        }
                    },
                    "required": [
                        "contents"
                    ]
                }
            ]
        },
        "XMLPointTag": {
            "allOf": [
                {
                    "$ref": "XML"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^XMLPointTag$"
                        },
                        "contents": {
                            "type": "array",
                            "items": {
                                "$ref": "XML"
                            }
                        }
                    },
                    "required": [
                        "contents"
                    ]
                }
            ]
        },
        "XMLName": {
            "allOf": [
                {
                    "$ref": "XML"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^XMLName$"
                        },
                        "contents": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "$ref": "[ XML ]"
                                }
                            ]
                        }
                    },
                    "required": [
                        "contents"
                    ]
                }
            ]
        },
        "XMLAttribute": {
            "allOf": [
                {
                    "$ref": "XML"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^XMLAttribute$"
                        },
                        "value": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "value"
                    ]
                }
            ]
        },
        "XMLCdata": {
            "allOf": [
                {
                    "$ref": "XML"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^XMLCdata$"
                        },
                        "contents": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "contents"
                    ]
                }
            ]
        },
        "XMLComment": {
            "allOf": [
                {
                    "$ref": "XML"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^XMLComment$"
                        },
                        "contents": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "contents"
                    ]
                }
            ]
        },
        "XMLProcessingInstruction": {
            "allOf": [
                {
                    "$ref": "XML"
                },
                {
                    "properties": {
                        "type": {
                            "pattern": "^XMLProcessingInstruction$"
                        },
                        "target": {
                            "type": "string"
                        },
                        "contents": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "null"
                                }
                            ]
                        }
                    },
                    "required": [
                        "target",
                        "contents"
                    ]
                }
            ]
        }
    };

    var astMatch = {
        tv4: tv4,
        test: test,
        importSchema: importSchema
    };

    importSchema(schema);

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = astMatch;
    } else {
        root.astMatch = astMatch;
    }

}(this));
