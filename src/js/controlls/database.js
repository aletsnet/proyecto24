const checkDB = async () => {
        sqlite.namedb = "mydb";
        const result = await sqlite.checkModel();
        console.log("Database check result:", result);
        alert("Database check result: " + JSON.stringify(result));
    }

export default {checkDB};