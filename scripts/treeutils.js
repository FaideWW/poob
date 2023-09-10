const rawTree = require("../data/skilltree/3_22/data.json");

function findUniqueFields(key) {
  const uniqueFields = new Set();

  Object.values(rawTree[key]).forEach((group) => {
    Object.entries(group).forEach(([key, val]) => {
      uniqueFields.add(key);
    });
  });

  return uniqueFields.keys();
}

console.log("group fields:", findUniqueFields("groups"));
console.log("node fields:", findUniqueFields("nodes"));
