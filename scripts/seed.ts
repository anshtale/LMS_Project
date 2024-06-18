const {PrismaClient} = require("@prisma/client");

const database = new PrismaClient();
async function main(){
    try{
        await database.category.createMany({
            data:[
                {name : "Computer Science"},
                {name : "Music Science"},
                {name : "Fitness"},
                {name : "Photography"},
                {name : "Web development"},
                {name : "Machine Learning"},
            ]
        })
        console.log("success");
    }catch(error){
        console.log("error")
    }finally{
        database.$disconnect();
    }
}
main();