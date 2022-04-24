const main = async () =>{
    const whitelistContractFactory = await hre.ethers.getContractFactory('Whitelists');
    const whitelistContract = await whitelistContractFactory.deploy(20);
    await whitelistContract.deployed();
    console.log("contract deployed to:", whitelistContract.address);


};

const runMain = async ()=>{
    try{
        await main();
        process.exit(0);
    }catch(error){
        console.log(error);
        process.exit(1);
    }
}

runMain();