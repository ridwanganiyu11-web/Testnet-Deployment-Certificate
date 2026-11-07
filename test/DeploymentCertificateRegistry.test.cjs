const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DeploymentCertificateRegistry", function () {
  let registry;
  let owner;
  let developer;

  beforeEach(async function () {
    [owner, developer] = await ethers.getSigners();
    const RegistryFactory = await ethers.getContractFactory("DeploymentCertificateRegistry");
    registry = await RegistryFactory.deploy();
    await registry.waitForDeployment();
  });

  it("should initialize with zero deployments count", async function () {
    expect(await registry.getDeploymentCount()).to.equal(0);
  });

  it("should register a deployment and emit DeploymentRegistered event", async function () {
    const dummyFingerprint = ethers.keccak256(ethers.toUtf8Bytes("BotPay-Metadata-v1.0.0"));
    const dummyContractAddr = "0x38F24C589Ac41C8Eb38A18210355f32a76B9c6e5";
    const dummyTx = "0x8f2d5a1bc36ef629810d7ef320aa112f483c65961d15db4a74284d7fb8fbc910";

    const tx = await registry.connect(developer).registerDeployment(
      "BotPay",
      "BotPay.sol",
      dummyContractAddr,
      dummyTx,
      "v1.0.0",
      dummyFingerprint,
      true
    );

    await expect(tx)
      .to.emit(registry, "DeploymentRegistered")
      .withArgs(
        1001,
        dummyContractAddr,
        developer.address,
        "BotPay",
        "BotPay.sol",
        anyValue,
        anyValue,
        dummyFingerprint
      );

    expect(await registry.getDeploymentCount()).to.equal(1);

    const cert = await registry.getCertificate(1001);
    expect(cert.projectName).to.equal("BotPay");
    expect(cert.contractName).to.equal("BotPay.sol");
    expect(cert.contractAddress).to.equal(dummyContractAddr);
    expect(cert.deployer).to.equal(developer.address);
    expect(cert.version).to.equal("v1.0.0");
    expect(cert.isBytecodeVerified).to.be.true;
    expect(cert.metadataFingerprint).to.equal(dummyFingerprint);

    // Verify fingerprint function
    expect(await registry.verifyCertificate(1001, dummyFingerprint)).to.be.true;
    expect(await registry.verifyCertificate(1001, ethers.ZeroHash)).to.be.false;

    // Verify developer certificates list
    const devCerts = await registry.getMyDeployments(developer.address);
    expect(devCerts.length).to.equal(1);
    expect(devCerts[0]).to.equal(1001);
  });
});

const anyValue = () => true;

