
const fs = require('fs')
const path = require('path')

const config = require('./minipack.config')

const entry = config.entry;


function createAsset(entry){

    const content = fs.readFileSync(entry, 'utf-8');
    const babelParser = require('@babel/parser')       //讲源码解析为AST
    const ast = babelParser.parse(content,{
        sourceType: 'module'
    })


    const dependencies = []

    const traverse = require('@babel/traverse').default        //遍历AST节点

    traverse(ast, {
        Identifier(path){     //遍历声明的遍历
            if(path.node.name == 'test1')
            {
                path.node.name = 'test'
            }
        },
        CallExpression(path) {        //函数调用的遍历
            // 对语法树中特定的节点进行操作 参考@babel/types （特定节点类型）
            // CallExpression 特定节点
            if(path.node.callee.name == 'show')
            {
                path.node.callee.name = 'show1'
            }
        },
        FunctionDeclaration: function(path) {      //函数声明的遍历
            // 对语法树中特定的节点进行操作 参考@babel/types （特定节点类型）
            // FunctionDeclaration 特定节点
            if(path.node.id.name == 'show1')
            {
//                path.node.id.name = 'show'
            }
//            console.log(path.node)
        },
        enter(path) {
            // 进入节点
            if (path.node.type === "ThisExpression") {
                // 对所有的操作
            };
        },
        exit(path) {
            // 退出节点
//            console.log(`  exit ${path.type}(${path.key})`)
        },
        ImportDeclaration: ({node}) => {
            dependencies.push(node.source.value)
        }
    })

    const { transformFromAst } = require('@babel/core')
    const { code } = transformFromAst(ast, null,{
        presets: ['@babel/preset-env']
    })

    return {
        ast,
        dependencies,
        code
    }

}

const mainAssert = createAsset(entry);

//console.log(mainAssert.ast.program.body[0])

eval(mainAssert.code);




