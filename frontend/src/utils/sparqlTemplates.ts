export type SPARQLTemplate = {
  title: string;
  query: string;
};

export const sparqlTemplates: SPARQLTemplate[] = [
  {
    title: "Class with data properties",
    query: `\
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX : <{schema uri}>

SELECT ?{var1} ?{var2}
WHERE {
  ?c rdf:type :{class} ;
     :{data prop 1} ?{var1} ;
     :{data prop 2} ?{var2} .
}
ORDER BY (?)
LIMIT ?
`,
  },
  {
    title: "Two classes linked by functional property",
    query: `\
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX : <{schema uri}>

SELECT ?{key var A} ?{key var B} ?{data var1} ?{data var2} 
WHERE {
  ?{class var A} rdf:type :{class A} ;
    :{key data prop} ?{class A key} ;
    :{data prop 1} ?{data var1} .
  ?{class var B} rdf:type :{class B} ;
    :{key data prop} ?{class B key} ;
    :{data property 2} ?{data var2} .
  ?{class var A} :{functional prop} ?{class var B} .
}
`,
  },
];
