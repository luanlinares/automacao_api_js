import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);

const app = require("../app");
const request = chai.request(app);
//const request = chai.request("http://localhost:3000");

const expect = chai.expect;

describe ("suite", () => {
    it("Meu primeiro teste", () => {
        expect(1).to.equals(1);
        console.log("Meu primeiro teste.");
    })

    it("Retornar mensagem Olá", (done) => {
        request
        .get("/hello")
        .end((erro, res) => {
            expect(res.body.message).to.equals("Ola NodeJs com express");
            done();
        })
    })
})

