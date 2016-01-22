var fs         = require('fs'),
    assert     = require('assert'),
    esprima    = require('esprima'),
    estraverse = require('estraverse'),
    astMatch   = require('../ast-match.js');

var ast = null;

function countEntries(schema) {
    var count = 0;
    estraverse.traverse(ast, {
        enter: function(node, parent) {
            if (astMatch.test(node, schema)) {
                count++;
            }
        }
    });
    return count;
}

describe('AST Match', function() {
    before(function() {
        ast = esprima.parse(fs.readFileSync('./test/source.js', {
            encoding: 'utf-8'
        }));
    });

    it('should be one program node', function() {
        assert.equal(countEntries('Program'), 1);
    });

    it('should be 2 variable declarations', function() {
        assert.equal(countEntries('VariableDeclaration'), 3);
    });

    it('should be one function declarations', function() {
        assert.equal(countEntries('FunctionDeclaration'), 1);
    });

    it('should be one function expression', function() {
        assert.equal(countEntries('FunctionExpression'), 1);
    });

    it('should be one "for" statement', function() {
        assert.equal(countEntries('ForStatement'), 1);
    });

    it('should be one "while" statement', function() {
        assert.equal(countEntries('WhileStatement'), 1);
    });

    it('should be one "f" function call expression with 2 arguments', function() {
        assert.equal(countEntries({
            allOf: [ { '$ref': 'CallExpression' }, {
                'properties': {
                    'callee': {
                        'allOf': [ { '$ref': 'Identifier' }, {
                            'properties': {
                                'name': { 'pattern': '^f$' }
                            }
                        }]
                    },
                    'arguments': {
                        'minItems': 2,
                        'maxItems': 2
                    }
                }
            }]
        }), 1);
    });

    after(function() {
        ast = null;
    });
});
