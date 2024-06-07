async function generateID(db) {
    let uid = `${Math.trunc(Math.random() * 999)}-${Math.trunc(Math.random() * 999)}-${Math.trunc(Math.random() * 9999)}`;

    try {
        await db.command({ ping: 1 });

        let result = await db.collection("ids").findOne({ uid: uid });
        if (result) {
            return await generateID(db);
        } else {
            await db.collection("ids").insertOne({ uid: uid });
            return uid;
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports = {
    generateID
};