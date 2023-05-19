
export type SPARQLTemplate = {
    title: string;
    query: string;
}

export const sparql_templates: SPARQLTemplate[] = [
  {
    title: "Class with data properties",
    query: `\
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX : <{uri}>

SELECT ?{var1} ?{var2}
WHERE {
  ?c rdf:type :{Class} ;
     :{prop1} ?{var1} ;
     :{prop2} ?{var1} .
}
ORDER BY (?)
LIMIT ?
`	
  },
];
