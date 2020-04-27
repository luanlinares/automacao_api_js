import chai from 'chai';
import chaiHttp from 'chai-http';
import tasksModel from '../models/task'
import task from '../models/task';
import { DocumentQuery } from 'mongoose';

chai.use(chaiHttp);

const app = require('../app');
const request = chai.request.agent(app);
const expect = chai.expect;
const rabbit = chai.request('http://rabbitmq:15672')

describe('post', () => {

    context('quando eu cadastro uma tarefa', () => {

        let task = { title: 'Estudar mongoose', owner: 'luanlnrs@gmail.com', done: false }

        before((done) => {
            rabbit
                .delete('/api/queues/%2F/tasksdev/contents')
                .auth('guest', 'guest')
                .end((err, res) => {
                    expect(res).to.has.status(204)
                    done();
                })
        })

        it('deve retornar 200 - cadastro com sucesso', (done) => {
            request
                .post('/task')
                .send(task)
                .end((err, res) => {
                    expect(res).to.has.status(200)
                    expect(res.body.data.title).to.be.an('string')
                    expect(res.body.data.owner).to.be.an('string')
                    expect(res.body.data.done).to.be.an('boolean')
                    done();
                })

        })

        it('e deve enviar um email', (done) => {

            let payload = { vhost: '/', name: 'tasksdev', truncate: '50000', ackmode: 'ack_requeue_true', encoding: 'auto', count: '1' }

            rabbit
                .post('/api/queues/%2F/tasksdev/get')
                .auth('guest', 'guest')
                .send(payload)
                .end((err, res) => {
                    expect(res).to.has.status(200)
                    expect(res.body[0].payload).to.contain(`Tarefa ${task.title} criada com sucesso!`)
                    done();
                })
        })
    })

    context('quando não informo o titulo', () => {
        let task = { title: '', owner: 'luanlnrs@gmail.com', done: false }

        it('deve retornar 400 - Not Found', (done) => {
            request
                .post('/task')
                .send(task)
                .end((err, res) => {
                    expect(res).to.has.status(400)
                    expect(res.body.errors.title.message).to.eql('Título é obrigatório!')
                    done();
                })

        })
    })

    context('quando não informo o owner', () => {
        let task = { title: 'Estudar mongoose', owner: '', done: false }

        it('deve retornar 400 - Bad Request', (done) => {
            request
                .post('/task')
                .send(task)
                .end((err, res) => {
                    expect(res).to.has.status(400)
                    expect(res.body.errors.owner.message).to.eql('Dono da tarefa é obrigatório!')
                    done();
                })

        })
    })

    context('quando a tarefa já existe', () => {
        let task = { title: 'Planejar Viagem', owner: 'luanlnrs@gmail.com', done: false }

        before((done) => {
            request
                .post('/task')
                .send(task)
                .end((err, res) => {
                    expect(res).to.has.status(200)
                    done();
                })
        })

        it('deve retornar 409 - Chave Duplicada', (done) => {
            request
                .post('/task')
                .send(task)
                .end((err, res) => {
                    expect(res).to.has.status(409)
                    expect(res.body.errmsg).to.include('duplicate key')
                    done();
                })

        })
    })
})