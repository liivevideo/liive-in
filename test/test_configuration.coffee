should = require('should')
assert = require('assert')

describe 'Configuration', () ->

    it 'configures the application correctly.', (done) ->
        process.env.KEY = "KEY"
        process.env.CERT = "CERT"
        process.env.CA = "CA"
        [config, sslOptions] = require '../server/config'
        config.env.should.be.equal('local')
        done()

