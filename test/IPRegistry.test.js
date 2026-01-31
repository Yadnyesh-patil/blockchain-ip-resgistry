const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("IPRegistry", function () {
    let ipRegistry;
    let owner;
    let user1;
    let user2;

    beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();

        const IPRegistry = await ethers.getContractFactory("IPRegistry");
        ipRegistry = await IPRegistry.deploy();
        await ipRegistry.waitForDeployment();
    });

    describe("Deployment", function () {
        it("Should deploy successfully", async function () {
            expect(await ipRegistry.getAddress()).to.be.properAddress;
        });

        it("Should start with zero registrations", async function () {
            expect(await ipRegistry.totalRegistrations()).to.equal(0);
        });
    });

    describe("Registration", function () {
        const testHash = "a1b2c3d4e5f6789012345678901234567890123456789012345678901234abcd";
        const testTitle = "My Innovation";
        const testDescription = "A revolutionary new idea";

        it("Should register a new IP", async function () {
            await ipRegistry.connect(user1).registerIP(testHash, testTitle, testDescription);

            const details = await ipRegistry.getIPDetails(testHash);
            expect(details.owner).to.equal(user1.address);
            expect(details.title).to.equal(testTitle);
            expect(details.description).to.equal(testDescription);
            expect(details.exists).to.be.true;
        });

        it("Should emit IPRegistered event", async function () {
            await expect(ipRegistry.connect(user1).registerIP(testHash, testTitle, testDescription))
                .to.emit(ipRegistry, "IPRegistered")
                .withArgs(user1.address, testHash, testTitle, (await ethers.provider.getBlock("latest")).timestamp + 1);
        });

        it("Should increment total registrations", async function () {
            await ipRegistry.connect(user1).registerIP(testHash, testTitle, testDescription);
            expect(await ipRegistry.totalRegistrations()).to.equal(1);
        });

        it("Should reject empty hash", async function () {
            await expect(
                ipRegistry.connect(user1).registerIP("", testTitle, testDescription)
            ).to.be.revertedWith("File hash cannot be empty");
        });

        it("Should reject duplicate registration", async function () {
            await ipRegistry.connect(user1).registerIP(testHash, testTitle, testDescription);

            await expect(
                ipRegistry.connect(user2).registerIP(testHash, "Another Title", "Another description")
            ).to.be.revertedWith("This file hash is already registered");
        });
    });

    describe("Verification", function () {
        const testHash = "deadbeef123456789012345678901234567890123456789012345678901234ab";
        const testTitle = "Test IP";
        const testDescription = "Test description";

        beforeEach(async function () {
            await ipRegistry.connect(user1).registerIP(testHash, testTitle, testDescription);
        });

        it("Should verify ownership correctly", async function () {
            const result = await ipRegistry.verifyOwnership(testHash);
            expect(result.owner).to.equal(user1.address);
            expect(result.exists).to.be.true;
        });

        it("Should return false for unregistered hash", async function () {
            const result = await ipRegistry.verifyOwnership("unregisteredhash1234567890123456789012345678901234567890abcd");
            expect(result.exists).to.be.false;
        });

        it("Should check registration status", async function () {
            expect(await ipRegistry.isRegistered(testHash)).to.be.true;
            expect(await ipRegistry.isRegistered("unregisteredhash")).to.be.false;
        });
    });

    describe("Owner Records", function () {
        it("Should track records by owner", async function () {
            const hash1 = "hash1234567890123456789012345678901234567890123456789012345678ab";
            const hash2 = "hash2234567890123456789012345678901234567890123456789012345678cd";

            await ipRegistry.connect(user1).registerIP(hash1, "Title 1", "Desc 1");
            await ipRegistry.connect(user1).registerIP(hash2, "Title 2", "Desc 2");

            const records = await ipRegistry.getRecordsByOwner(user1.address);
            expect(records.length).to.equal(2);
            expect(records[0]).to.equal(hash1);
            expect(records[1]).to.equal(hash2);
        });

        it("Should return empty array for user with no records", async function () {
            const records = await ipRegistry.getRecordsByOwner(user2.address);
            expect(records.length).to.equal(0);
        });

        it("Should return correct record count", async function () {
            const hash1 = "count1234567890123456789012345678901234567890123456789012345678ab";

            await ipRegistry.connect(user1).registerIP(hash1, "Title", "Desc");

            expect(await ipRegistry.getRecordCount(user1.address)).to.equal(1);
            expect(await ipRegistry.getRecordCount(user2.address)).to.equal(0);
        });
    });

    describe("Multiple Users", function () {
        it("Should handle registrations from multiple users", async function () {
            const hash1 = "user1hash234567890123456789012345678901234567890123456789012ab";
            const hash2 = "user2hash234567890123456789012345678901234567890123456789012cd";

            await ipRegistry.connect(user1).registerIP(hash1, "User 1 IP", "User 1 Desc");
            await ipRegistry.connect(user2).registerIP(hash2, "User 2 IP", "User 2 Desc");

            const details1 = await ipRegistry.getIPDetails(hash1);
            const details2 = await ipRegistry.getIPDetails(hash2);

            expect(details1.owner).to.equal(user1.address);
            expect(details2.owner).to.equal(user2.address);
            expect(await ipRegistry.totalRegistrations()).to.equal(2);
        });
    });
});
