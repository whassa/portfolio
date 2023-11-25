const request = require("supertest");
const app = require("../app.js");
const { MongoClient } = require("mongodb");

const getClientIp = (req) => {
  return req;
};

jest.mock("mongodb");

// Mock the 'request-ip' module
jest.mock("request-ip");

describe("test all the endpoint", () => {
  afterAll((done) => {
    app.close(done);
  });
  describe("GET /", () => {
    it("responds with 200 and match snapshot", (done) => {
      request(app)
        .get("/")
        .expect(200)
        .expect("Content-Type", "text/html; charset=utf-8")
        .end((err, res) => {
          if (err) return done(err);
          expect(res.text).toMatchSnapshot();

          done();
        });
    });
  });

  describe("GET /home", () => {
    it("responds with 200 and match snapshot", (done) => {
      request(app)
        .get("/home")
        .expect(200)
        .expect("Content-Type", "text/html; charset=utf-8")
        .end((err, res) => {
          if (err) return done(err);
          expect(res.text).toMatchSnapshot();
          done();
        });
    });
  });

  describe("GET /asciiMe", () => {
    it("responds with 200 and match snapshot", (done) => {
      request(app)
        .get("/asciiMe")
        .expect(200)
        .expect("Content-Type", "text/html; charset=utf-8")
        .end((err, res) => {
          if (err) return done(err);
          expect(res.text).toMatchSnapshot();
          done();
        });
    });
  });

  describe("GET /projectTarget", () => {
    it("responds with 200 and match snapshot", (done) => {
      request(app)
        .get("/projectTarget")
        .expect(200)
        .expect("Content-Type", "text/html; charset=utf-8")
        .end((err, res) => {
          if (err) return done(err);
          expect(res.text).toMatchSnapshot();
          done();
        });
    });
  });

  describe("GET /anywhere in the world", () => {
    it("responds with 200 and match snapshot", (done) => {
      request(app)
        .get("/anywhere_in_the_world")
        .expect(200)
        .expect("Content-Type", "text/html; charset=utf-8")
        .end((err, res) => {
          if (err) return done(err);
          expect(res.text).toMatchSnapshot();
          done();
        });
    });
  });

  describe("GET /works", () => {
    const collectionSpy = jest.fn(
      jest.fn(() => ({
        find: findSpy,
      }))
    );

    const findSpy = jest.fn(
      jest.fn(() => ({
        toArray: jest.fn(() => [
          { workExperience: "LikeMindedLab", vote: 1 },
          { workExperience: "Stingray", vote: -1 },
        ]),
      }))
    );

    it("responds with 200 and match snapshot", (done) => {
      const requestIp = require("request-ip");
      requestIp.getClientIp.mockImplementation(() => "192.168.1.1");
      const { MongoClient } = require("mongodb");
      MongoClient.connect = jest.fn();

      MongoClient.prototype.db = jest.fn(() => ({
        collection: collectionSpy,
      }));
      MongoClient.prototype.close = jest.fn();

      request(app)
        .get("/works")
        .expect(200)
        .expect("Content-Type", "text/html; charset=utf-8")
        .end((err, res) => {
          if (err) return done(err);
          expect(res.text).toMatchSnapshot();
          const clientInstance = MongoClient.mock.instances[0];
          expect(clientInstance.connect).toHaveBeenCalled();
          expect(clientInstance.db).toHaveBeenCalledWith(
            process.env.MONGODB_DB_NAME
          );
          expect(collectionSpy).toHaveBeenCalledWith(
            process.env.MONGODB_COLLECTION_NAME
          );
          expect(findSpy).toHaveBeenCalledWith(
            { ip: "192.168.1.1" },
            { projection: { _id: 0, ip: 0 } }
          );
          expect(clientInstance.close).toHaveBeenCalled();
          done();
        });
    });

    it("responds with 200 and there's actually no previous vote snapshot", (done) => {
      const requestIp = require("request-ip");
      requestIp.getClientIp.mockImplementation(() => "192.168.1.1");
      const { MongoClient } = require("mongodb");
      MongoClient.connect = jest.fn();

      const collectionSpy = jest.fn(
        jest.fn(() => ({
          find: findSpy,
        }))
      );

      const findSpy = jest.fn(
        jest.fn(() => ({
          toArray: jest.fn(() => []),
        }))
      );

      MongoClient.prototype.db = jest.fn(() => ({
        collection: collectionSpy,
      }));
      MongoClient.prototype.close = jest.fn();

      request(app)
        .get("/works")
        .expect(200)
        .expect("Content-Type", "text/html; charset=utf-8")
        .end((err, res) => {
          if (err) return done(err);
          expect(res.text).toMatchSnapshot();
          const clientInstance = MongoClient.mock.instances[0];
          expect(clientInstance.connect).toHaveBeenCalled();
          expect(clientInstance.db).toHaveBeenCalledWith(
            process.env.MONGODB_DB_NAME
          );
          expect(collectionSpy).toHaveBeenCalledWith(
            process.env.MONGODB_COLLECTION_NAME
          );
          expect(findSpy).toHaveBeenCalledWith(
            { ip: "192.168.1.1" },
            { projection: { _id: 0, ip: 0 } }
          );
          expect(clientInstance.close).toHaveBeenCalled();
          done();
        });
    });

    it("responds with 200 and match snapshot", (done) => {
      const requestIp = require("request-ip");
      requestIp.getClientIp.mockImplementation(() => "192.168.1.1");
      const { MongoClient } = require("mongodb");
      MongoClient.connect = jest.fn();

      const collectionSpy = jest.fn(
        jest.fn(() => ({
          find: findSpy,
        }))
      );

      const findSpy = jest.fn(
        jest.fn(() => ({
          toArray: jest.fn(() => {}),
        }))
      );

      MongoClient.prototype.db = jest.fn(() => ({
        collection: () => {
          throw new Error("Mocked error");
        },
      }));
      MongoClient.prototype.close = jest.fn();

      request(app)
        .get("/works")
        .expect(200)
        .expect("Content-Type", "text/html; charset=utf-8")
        .end((err, res) => {
          if (err) return done(err);
          expect(res.text).toMatchSnapshot();
          const clientInstance = MongoClient.mock.instances[0];
          expect(clientInstance.connect).toHaveBeenCalled();
          expect(findSpy).not.toHaveBeenCalled();
          expect(collectionSpy).not.toHaveBeenCalled();
          expect(clientInstance.close).toHaveBeenCalled();
          done();
        });
    });
  });
  describe("PUT /api/vote", () => {
    it("responds with 400 client doesn't find an IP", (done) => {
      const requestIp = require("request-ip");
      requestIp.getClientIp.mockImplementation(() => undefined);
      request(app)
        .put("/api/vote")
        .expect(400)
        .expect("Content-Type", "text/html; charset=utf-8")
        .end((err, res) => {
          expect(res.body).toEqual("Parameters are not correctly sets");
          done();
        });
    });

    it("responds with 400 find an IP, but with wrong work experience", (done) => {
      const requestIp = require("request-ip");
      requestIp.getClientIp.mockImplementation(() => "192.168.1");
      request(app)
        .put("/api/vote")
        .send({
          vote: 1,
          workExperience: "Sudowoodo",
        })
        .expect(400)
        .expect("Content-Type", "text/json; charset=utf-8")
        .end((err, res) => {
          expect(res.body).toEqual("Parameters are not correctly sets");
          done();
        });
    });

    it("responds with 200 test is sucessful vote is 1", (done) => {
      const requestIp = require("request-ip");
      requestIp.getClientIp.mockImplementation(() => "192.168.1");

      const { MongoClient } = require("mongodb");
      MongoClient.connect = jest.fn();

      const collectionSpy = jest.fn(() => {
        return {
          updateOne: updateOneSpy,
        }}
      );
      const updateOneSpy = jest.fn();


      MongoClient.prototype.db = jest.fn(() => ({
        collection: collectionSpy,
      }));
      MongoClient.prototype.close = jest.fn();

      request(app)
        .put("/api/vote")
        .query({
          vote: 1,
          workExperience: "Stingray",
        })
        .expect(200)
        .expect("Content-Type", "text/json; charset=utf-8")
        .end((err, res) => {
          expect(res.body).toEqual("Success!");
          const clientInstance = MongoClient.mock.instances[0];

          expect(clientInstance.connect).toHaveBeenCalled();
          expect(clientInstance.db).toHaveBeenCalledWith(
            process.env.MONGODB_DB_NAME
          );
          expect(collectionSpy).toHaveBeenCalledWith(
            process.env.MONGODB_COLLECTION_NAME
          );
          expect(updateOneSpy).toHaveBeenCalledWith(
            { ip: "192.168.1", workExperience: "Stingray" },
            { $set: { ip: "192.168.1", workExperience: "Stingray", vote: 1 } },
            { upsert: true }
          );
          done();
        });
    });

    it("responds with 200 test is sucessful vote is -1", (done) => {
      const requestIp = require("request-ip");
      requestIp.getClientIp.mockImplementation(() => "192.168.1");

      const { MongoClient } = require("mongodb");
      MongoClient.connect = jest.fn();

      const collectionSpy = jest.fn(() => {
        return {
          updateOne: updateOneSpy,
        }}
      );
      const updateOneSpy = jest.fn();


      MongoClient.prototype.db = jest.fn(() => ({
        collection: collectionSpy,
      }));
      MongoClient.prototype.close = jest.fn();

      request(app)
        .put("/api/vote")
        .query({
          vote: -1,
          workExperience: "Stingray",
        })
        .expect(200)
        .expect("Content-Type", "text/json; charset=utf-8")
        .end((err, res) => {
          expect(res.body).toEqual("Success!");
          const clientInstance = MongoClient.mock.instances[0];

          expect(clientInstance.connect).toHaveBeenCalled();
          expect(clientInstance.db).toHaveBeenCalledWith(
            process.env.MONGODB_DB_NAME
          );
          expect(collectionSpy).toHaveBeenCalledWith(
            process.env.MONGODB_COLLECTION_NAME
          );
          expect(updateOneSpy).toHaveBeenCalledWith(
            { ip: "192.168.1", workExperience: "Stingray" },
            { $set: { ip: "192.168.1", workExperience: "Stingray", vote: -1 } },
            { upsert: true }
          );
          done();
        });
    });

    it("responds with 500 update unsucesfull", (done) => {
      const requestIp = require("request-ip");
      requestIp.getClientIp.mockImplementation(() => "192.168.1");

      const { MongoClient } = require("mongodb");
      MongoClient.connect = jest.fn();

      MongoClient.prototype.db = jest.fn(() => ({
        collection: () => { throw Error('error') },
      }));
      MongoClient.prototype.close = jest.fn();

      request(app)
        .put("/api/vote")
        .query({
          vote: 1,
          workExperience: "Stingray",
        })
        .expect(500)
        .expect("Content-Type", "text/json; charset=utf-8")
        .end((err, res) => {
          expect(res.body).toEqual("Error from our side please try again");
          const clientInstance = MongoClient.mock.instances[0];
          expect(clientInstance.connect).toHaveBeenCalled();
        
          done();
        });
    });
  });
});
