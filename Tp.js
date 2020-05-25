const neo4j = require('neo4j-driver');
const driver = new neo4j.driver("bolt://52.252.99.100/:7474", neo4j.auth.basic("neo4j", "NuV9sXUJzjve"));

const session = driver.session();

tp = async () => {

    try {
        console.log('start');
        const cypher = "MATCH (n) RETURN n";
        const correlation = "MATCH p=(n:Organisation {name: $name1})-[r:correlation]->() RETURN p"
        const params = { name1: "IFCI.NS"};

        const result = await session.run(correlation, params);

        const singleRecord = result.records[0]
        const node = singleRecord.get(0)

        // console.log(singleRecord)
        console.log('finished find');
        return result.records;
        /* for (var i=0;i<result.records.length;i++)
        {
            console.log(result.records[i]._fields[0].segments[0].relationship.properties.value)
        } */

    } catch (e) {
        console.log(e)
    } finally {
        await session.close()
    }

}

module.exports = tp;

