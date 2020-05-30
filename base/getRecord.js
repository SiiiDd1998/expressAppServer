const neo4j = require('neo4j-driver');
const driver = new neo4j.driver("bolt://52.252.99.100/:7687", neo4j.auth.basic("neo4j", "NuV9sXUJzjve"));


relations = {
    Organisation: 'correlation',
    Commodity: 'volatility'
}

graph = {}


graph.getNodeVolatility = async({symbol, label}) => {

    if(label == 'Commodity') return {}
    const session = driver.session();

    try {
        // console.log('start');
        const relationQuery = `MATCH p=(n:Commodity)-[r:volatility]->(m:Organisation {name: $symbol}) RETURN p LIMIT 10`
        const params = { symbol };
        // console.log(relationQuery);
        const result = await session.run(relationQuery, params);

        // console.log('finished find');
        return result.records[0];

    } catch (e) {
        console.log(e)
    } finally {
        await session.close()
    }
}

graph.getRelations = async ({ label, symbol }) => {
    const session = driver.session();

    try {
        // console.log('start');
        const relationQuery = `MATCH p=(n:${label} {name: $symbol})-[: ${relations[label]}]->() RETURN p`
        const params = { symbol };
        const result = await session.run(relationQuery, params);

        // console.log('finished find');
        return result.records;

    } catch (e) {
        console.log(e)
    } finally {
        await session.close()
    }
}

module.exports = graph;
