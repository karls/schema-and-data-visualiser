
export type SPARQLTemplate = {
    title: string;
    query: string;
}

export const sparql_templates: SPARQLTemplate[] = [
  {
    title: "Get properties",
    query: `\
PREFIX uriRoot: <http://example.com/rootOfUris#>	
# select the variables that are populated in the WHERE clause
SELECT ?var1 ?var2
WHERE {
    ?instanceOfClass a uriRoot:ClassName ;
        uriRoot:varName1 ?var1 ;
    # use a prefix to abbreviate a property URI as shown above
    # or use the full URI as shown below			
    <http://example.com/rootOfUris#varName2> ?var2 .
}`,
  },
];
