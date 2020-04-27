import chai from 'chai';
import chaiHttp from 'chai-http';
import tasksModel from '../models/task'
import task from '../models/task';

chai.use(chaiHttp);

const app = require('../app');
const request = chai.request.agent(app);
const expect = chai.expect;


describe('get', () => {

    context('quando eu tenho tarefas cadastradas', () => {
        before((done) => {
            let tasks = [
                { title: 'Estudar NodeJs', owner: 'luanlnrs@gmail.com', done: false },
                { title: 'Fazer Compras', owner: 'luanlnrs@gmail.com', done: false },
                { title: 'Estudar MongoDB', owner: 'luanlnrs@gmail.com', done: true }
            ]

            tasksModel.insertMany(tasks);
            done();

        })


        it('deve retornar uma lista', (done) => {
            request
                .get('/task')
                .end((err, res) => {
                    expect(res).to.has.status(200);
                    //console.log(typeof res.body.data);
                    expect(res.body.data).to.be.an('array');
                    done();
                })
        })

        it('deve filtrar por palavra chave', (done) => {
            request
                .get('/task')
                .query({ title: 'Estudar' })
                .end((err, res) => {
                    expect(res).to.has.status(200);
                    expect(res.body.data[0].title).to.equal('Estudar NodeJs')
                    expect(res.body.data[1].title).to.equal('Estudar MongoDB')
                    done();
                })
        })
    })

    context('quando busco por id', () => {

        it('deve retornar uma única tarefa', (done) => {
            let tasks = [
                { title: 'Ler um livro de javascript', owner: 'luanlnrs@gmail.com', done: false },
            ]

            tasksModel.insertMany(tasks, (err, result) => {
                let id = result[0]._id
                request
                    .get('/task/' + id)
                    .end((err, res) => {
                        expect(res).to.has.status(200);
                        //expect(res.body.data.title).to.equal('Ler um livro de javascript')
                        //Outra forma de validar usando a própria massa de testes
                        expect(res.body.data.title).to.equal(tasks[0].title);
                        done();
                    })
            });

        })
    })

    context('quando o id não existe', () => {

        it('deve retornar erro 404 - not found ', (done) => {
            let id = require('mongoose').Types.ObjectId();
            request
                .get('/task/' + id)
                .end((err, res) => {
                    expect(res).to.has.status(404);
                    expect(res.body).to.eql({});
                    done();
                })
        })

    })

})