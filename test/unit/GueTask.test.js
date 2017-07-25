const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
const ChaiAsPromised = require('chai-as-promised');
const GueTask = require('../../lib/GueTask');

chai.use(ChaiAsPromised);

describe('GueTask', () => {

  describe('constructor', () => {

    it('should require a name', () => {
      expect(()=> {
        new GueTask('', ['task','list'], () => {});
      }).to.throw();
    });

    it('should require an action', () => {
      expect(() => {
        new GueTask('foo');
      }).to.throw();
    });

    it('should make sure that action is a function', () => {
      expect(() => {
        new GueTask('foo','NotAFunction');
      }).to.throw();
    });

    it('should successfully create a task', ()=> {
      const sampleFn = () => {console.log('woot');};
      const testTask = {
        name: 'foo',
        dependencies: ['task','list'],
        action: sampleFn,
        startTime: 0,
        endTime: 0
      };

      const newTask = new GueTask('foo',['task','list'], sampleFn);
      expect(newTask).to.deep.equal(testTask);
    });

    it('should correctly handle a task without dependencies', () => {
      const sampleFn = ()=> {console.log('woot');};

      const testTask = {
        name: 'foo',
        dependencies: undefined,
        action: sampleFn,
        startTime: 0,
        endTime: 0
      };

      const newTask = new GueTask('foo',sampleFn);
      expect(newTask).to.deep.equal(testTask);
    });

    it('should throw if dependencies is not an array', () => {
      const sampleFn = () => {console.log('woot');};
      expect(()=> {
        new GueTask('foo', sampleFn, sampleFn);
      }).to.throw();
    });

    it('should ensure that action is a function', ()=> {
      const sampleFn = () => {console.log('woot');};
      expect(()=> {
        new GueTask('foo', ['bar'], 'foo');
      }).to.throw();
    });
  });

  describe('hasDependencies', () => {
    it('should return true if there are dependencies', () => {
      const gueTask = new GueTask('foo',['bar']);
      expect(gueTask.hasDependencies()).to.be.true;
    });

    it('should return false if there are no dependencies', () => {
      const gueTask = new GueTask('foo',() => {return Promise.resolve();});
      expect(gueTask.hasDependencies()).to.be.false;
    });
  });

  describe('execute', () => {
    it('should run the action', ()=> {
      const gueTask = new GueTask('foo',() => {
        return new Promise((resolve,reject)=> {
          setTimeout(function() {
            resolve();
          }, 50);
        });
      });
      return expect(gueTask.execute()).to.be.fulfilled;
    });
  });
});
