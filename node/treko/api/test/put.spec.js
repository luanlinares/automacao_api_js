import chai from 'chai';
import chaiHttp from 'chai-http';
import tasksModel from '../models/task'
import task from '../models/task';
import { Mongoose } from 'mongoose';

chai.use(chaiHttp);

const app = require('../app');
const request = chai.request.agent(app);
const expect = chai.expect;

describe('put', () => {
    context('quando eu altero uma tarefa', () => {

        let task = {
            _id: require('mongoose').Types.ObjectId(),
            title: 'fazer compras',
            owner: 'luanlnrs@gmail.com',
            done: false
        }

        before((done) => {
            tasksModel.insertMany([task])
            done();
        })


        it('deve retornar 200', (done) => {
            task.title = 'Lavar Roupas',
                task.done = true
            request
                .put('/task/' + task._id)
                .send(task)
                .end((err, res) => {
                    expect(res).to.has.status(200)
                    expect(res.body).to.eql({})
                    done();
                })
        })

        it('deve retornar os dados atualizados', (done) => {
            request
                .get('/task/' + task._id)
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.body.data.title).to.eql(task.title)
                    expect(res.body.data.done).to.be.true
                    done();
                })
        })
    })
})