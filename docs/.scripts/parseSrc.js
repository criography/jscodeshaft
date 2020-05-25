const fs = require('fs').promises;
const path = require('path');

const $typeDefs = {};



/**
 *
 * @param propType
 * @returns {RegExp|null}
 */
const getRegexByPropType = (propType) => {
  switch (propType) {
    case 'typedef':
      return new RegExp(`^${propType}\\s+?\{(.*?)}\\s+?([a-zA-Z0-9]+?)$`);

    case 'param':
      return new RegExp(`^${propType}\\s+?\{(.*?)}\\s+?([a-zA-Z0-9]+?)(\\s+?(.*?))?$`);

    case 'todo':
      return new RegExp(`^${propType}\\s+?(.+?)$`, 'i');

    case 'see':
      return new RegExp(`^${propType}\\s+?(\\S*?)(\\s+.*?)?$`);

    case 'return':
    case 'returns':
      return new RegExp(`^${propType}\\s+?\{([a-zA-Z0-9]+?)}(\\s+.*?)?$`);

    default:
      throw new Error('unsupported JSDoc property type')
  }
};


const parseTypeDefBlock = (input) => {
  let typeDef;
  const meta = {
    type: undefined,
    returns: undefined,
    params: [],
    todos: [],
    see: [],
  };

  // try to convert all chunks's data to an object.
  input
    .split('@')
    .forEach(chunk => {
      const sanitisedChunk = chunk
        .split('\n')
        // strip empty lines
        .filter(line => line && !/^[\s*/]*?$/.test(line))
        // strip comment furniture before merging multiline statements
        .map(line => line.replace(/^\s*?\*\s*?(\S|$)/, `$1`))
        .join('')
        .trim();

      if(sanitisedChunk){
        // extract JSDoc property name (e.g. 'returns' or 'param'
        const prop = sanitisedChunk.match(/^(\w+?)\s/)[1].toLowerCase();

        // based on this name and its associated syntax, try to extract metadata
        const extractedChunkMeta = sanitisedChunk.match(getRegexByPropType(prop)) || Array(3);

        switch (prop) {
          case 'typedef': {
            const [chunkSyntaxMatch, type, name] = extractedChunkMeta;
            if(chunkSyntaxMatch){

              if($typeDefs[name]){
                throw new Error(`typedef "${name}" already exists. Remove duplicates from your code!`);
              }

              typeDef = name;
              meta.type = type;
            }
            break;
          }

          case 'param': {
            const [chunkSyntaxMatch, type, name, descriptionMatch, description] = extractedChunkMeta;
            if(chunkSyntaxMatch){
              const paramInfo = { type };

              if(descriptionMatch && description){
                paramInfo.description = description.trim();
              }

              meta.params.push({
                [name] : paramInfo
              })
            }
            break;
          }

          case 'return':
          case 'returns': {
            const [chunkSyntaxMatch, type, description] = extractedChunkMeta;
            if(chunkSyntaxMatch && type){
              const returnInfo = { type };

              if(description){
                returnInfo.description = description.trim();
              }

              meta.returns = returnInfo;
            }
            break;
          }

          case 'todo': {
            const [chunkSyntaxMatch, description] = extractedChunkMeta;

            if(chunkSyntaxMatch && description){
              meta.todos.push(description.trim());
            }

            break;
          }

          case 'see': {
            const [chunkSyntaxMatch, url, description] = extractedChunkMeta;
            if(chunkSyntaxMatch && url){
              const seeInfo = { url };

              if(description){
                seeInfo.description = description.trim();
              }

              meta.see.push(seeInfo);
            }
            break;
          }
        }

        if(typeDef){
          $typeDefs[typeDef] = meta;
        }
      }
    })
}



fs.readFile(path.resolve(__dirname, '../../lib/attributes.js'))
  .then(data => {
    const fileContent = data.toString();
    const typeDefs = [...fileContent.matchAll(/\/\*\*([\s\S]+?)\*\//gm)]
      .forEach(([match]) => {
        if(match.includes('@typedef')){
          parseTypeDefBlock(match);
        }
      })
console.log(JSON.stringify($typeDefs, null, 2));
    //console.log(typeDefs);
/*    const exportedFuncs = [...data.toString().matchAll(/\/\*\*[\s\S]*?export const (\w+?)\s*?=/gm)];
    exportedFuncs.map(([match]) => {
      const matchAsLines = match.split('\n');
      const funcName = matchAsLines.pop().replace(/\s*export\s+const\s+(\w+)\s?=/, "$1");
      const docBlocks = match.matchAll(/\/\*\*([\s\S]*?)\*\//gm);

      if(docBlocks.length > 1){

      }
    })*/

  });



